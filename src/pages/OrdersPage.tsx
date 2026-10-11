// =====================================================================
// صفحه سفارش‌ها با TanStack Table.
// TanStack «منطق» جدول را می‌دهد (مرتب‌سازی، فیلتر، صفحه‌بندی) و ظاهر
// را کاملاً به ما می‌سپارد؛ به این نوع کتابخانه «headless» می‌گویند.
// =====================================================================
import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
} from '@tanstack/react-table'
import { ArrowDown, ArrowUp, ArrowUpDown, Download, Search } from 'lucide-react'
import { customerById, orders, products } from '../data/mock'
import { ORDER_STATUSES, type Order, type OrderStatus } from '../data/types'
import { useSettings } from '../context/settings'
import { useFormat } from '../lib/format'
import { downloadCsv } from '../lib/csv'
import PageHeader from '../components/ui/PageHeader'
import StatusBadge from '../components/ui/StatusBadge'
import Pagination from '../components/ui/Pagination'
import EmptyState from '../components/ui/EmptyState'

/** هر ردیف جدول: سفارش + نام مشتری و محصول (به زبان فعلی) */
type Row = Order & { customer: string; product: string; email: string; haystack: string }

const productById = new Map(products.map((p) => [p.id, p]))
const col = createColumnHelper<Row>()

export default function OrdersPage() {
  const { t, local } = useSettings()
  const f = useFormat()

  // جستجو و فیلتر وضعیت در آدرس صفحه نگه داشته می‌شوند (?q=...&status=...)
  const [params, setParams] = useSearchParams()
  const query = params.get('q') ?? ''
  const status = (params.get('status') ?? 'all') as OrderStatus | 'all'
  const update = (key: string, value: string) => {
    const next = new URLSearchParams(params)
    if (value && value !== 'all') next.set(key, value)
    else next.delete(key)
    setParams(next, { replace: true })
  }

  const [sorting, setSorting] = useState<SortingState>([{ id: 'date', desc: true }])
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 })

  // ساخت ردیف‌ها؛ فقط وقتی زبان عوض شود دوباره ساخته می‌شوند (useMemo)
  const rows = useMemo<Row[]>(
    () =>
      orders.map((o) => {
        const c = customerById.get(o.customerId)!
        const p = productById.get(o.productId)!
        return {
          ...o,
          customer: local(c.name),
          email: c.email,
          product: local(p.name),
          // متن قابل جستجو: هر دو زبان + ایمیل + شماره سفارش
          haystack: [o.id, c.name.en, c.name.fa, c.email, p.name.en, p.name.fa].join(' ').toLowerCase(),
        }
      }),
    [local],
  )

  // تعداد سفارش هر وضعیت برای نمایش روی دکمه‌های فیلتر
  const counts = useMemo(() => {
    const m: Record<string, number> = { all: rows.length }
    for (const r of rows) m[r.status] = (m[r.status] ?? 0) + 1
    return m
  }, [rows])

  const filtered = useMemo(() => (status === 'all' ? rows : rows.filter((r) => r.status === status)), [rows, status])

  const columns = useMemo(
    () => [
      col.accessor('id', {
        header: t('orders.id'),
        cell: (c) => <span className="whitespace-nowrap font-medium text-slate-900 dark:text-white" dir="ltr">{c.getValue()}</span>,
      }),
      col.accessor('customer', {
        header: t('orders.customer'),
        cell: (c) => (
          <div className="flex items-center gap-3">
            <span className="grid size-8 shrink-0 place-items-center rounded-full bg-brand-50 text-xs font-semibold text-brand-700 dark:bg-brand-500/15 dark:text-brand-200">
              {c.getValue().slice(0, 1)}
            </span>
            <div className="min-w-0">
              <p className="truncate font-medium">{c.getValue()}</p>
              <p className="truncate text-xs text-slate-500 dark:text-slate-400">{c.row.original.email}</p>
            </div>
          </div>
        ),
      }),
      col.accessor('product', { header: t('orders.product') }),
      col.accessor('date', {
        header: t('orders.date'),
        cell: (c) => <span className="whitespace-nowrap text-slate-600 dark:text-slate-300">{f.date(c.getValue())}</span>,
      }),
      col.accessor('payment', {
        header: t('orders.payment'),
        enableSorting: false,
        cell: (c) => t(`payment.${c.getValue()}`),
      }),
      col.accessor('status', {
        header: t('orders.status'),
        cell: (c) => <StatusBadge status={c.getValue()} />,
      }),
      col.accessor('total', {
        header: t('orders.total'),
        cell: (c) => <span className="tabular font-semibold">{f.moneyExact(c.getValue())}</span>,
        meta: { align: 'end' },
      }),
    ],
    // ستون‌ها با تغییر زبان (t و f) دوباره ساخته می‌شوند تا عنوان‌ها ترجمه شوند
    [t, f],
  )

  const table = useReactTable({
    data: filtered,
    columns,
    state: { sorting, globalFilter: query, pagination },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    // جستجوی سفارشی: در متن ترکیبی هر ردیف (هر دو زبان) دنبال عبارت بگرد
    globalFilterFn: (row, _columnId, value: string) => row.original.haystack.includes(value.trim().toLowerCase()),
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    autoResetPageIndex: true,
  })

  const visibleRows = table.getFilteredRowModel().rows

  const exportCsv = () => {
    const sorted = table.getSortedRowModel().rows
    downloadCsv(
      `orders-${new Date().toISOString().slice(0, 10)}.csv`,
      [t('orders.id'), t('orders.customer'), t('orders.product'), t('orders.date'), t('orders.status'), t('orders.total')],
      sorted.map(({ original: r }) => [r.id, r.customer, r.product, r.date.slice(0, 10), t(`status.${r.status}`), r.total]),
    )
  }

  const clear = () => setParams(new URLSearchParams(), { replace: true })

  return (
    <>
      <PageHeader
        title={t('orders.title')}
        subtitle={t('orders.subtitle')}
        actions={
          <button className="btn btn-ghost" onClick={exportCsv}>
            <Download className="size-4" />
            {t('orders.exportCsv')}
          </button>
        }
      />

      <div className="card overflow-hidden">
        {/* نوار ابزار: جستجو + فیلتر وضعیت */}
        <div className="flex flex-col gap-3 border-b border-slate-100 p-4 lg:flex-row lg:items-center lg:justify-between dark:border-slate-800">
          <div className="relative w-full lg:max-w-xs">
            <Search className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={query}
              onChange={(e) => update('q', e.target.value)}
              placeholder={t('topbar.search')}
              aria-label={t('topbar.search')}
              className="input ps-9"
            />
          </div>
          <div className="-mx-1 flex gap-1 overflow-x-auto px-1 pb-1 lg:pb-0" role="tablist">
            {(['all', ...ORDER_STATUSES] as const).map((s) => (
              <button
                key={s}
                role="tab"
                aria-selected={status === s}
                onClick={() => update('status', s)}
                className={`inline-flex shrink-0 items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                  status === s
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                }`}
              >
                {s === 'all' ? t('common.all') : t(`status.${s}`)}
                <span className={`tabular rounded-md px-1.5 text-xs ${status === s ? 'bg-white/20 dark:bg-slate-900/10' : 'bg-slate-100 dark:bg-slate-800'}`}>
                  {f.number(counts[s] ?? 0)}
                </span>
              </button>
            ))}
          </div>
        </div>

        {visibleRows.length === 0 ? (
          <EmptyState onClear={clear} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] text-sm">
              <thead className="bg-slate-50/80 dark:bg-slate-800/40">
                {table.getHeaderGroups().map((hg) => (
                  <tr key={hg.id}>
                    {hg.headers.map((h) => {
                      const sorted = h.column.getIsSorted()
                      const end = (h.column.columnDef.meta as { align?: string } | undefined)?.align === 'end'
                      return (
                        <th
                          key={h.id}
                          className={`px-5 py-3 text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400 ${end ? 'text-end' : 'text-start'}`}
                          aria-sort={sorted === 'asc' ? 'ascending' : sorted === 'desc' ? 'descending' : 'none'}
                        >
                          {h.column.getCanSort() ? (
                            <button
                              onClick={h.column.getToggleSortingHandler()}
                              className={`inline-flex items-center gap-1 uppercase hover:text-slate-900 dark:hover:text-white ${sorted ? 'text-slate-900 dark:text-white' : ''}`}
                            >
                              {flexRender(h.column.columnDef.header, h.getContext())}
                              {sorted === 'asc' ? <ArrowUp className="size-3.5" /> : sorted === 'desc' ? <ArrowDown className="size-3.5" /> : <ArrowUpDown className="size-3.5 opacity-40" />}
                            </button>
                          ) : (
                            flexRender(h.column.columnDef.header, h.getContext())
                          )}
                        </th>
                      )
                    })}
                  </tr>
                ))}
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {table.getRowModel().rows.map((r) => (
                  <tr key={r.id} className="transition hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    {r.getVisibleCells().map((c) => {
                      const end = (c.column.columnDef.meta as { align?: string } | undefined)?.align === 'end'
                      return (
                        <td key={c.id} className={`px-5 py-3 ${end ? 'text-end' : ''}`}>
                          {flexRender(c.column.columnDef.cell, c.getContext())}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <Pagination
          page={pagination.pageIndex}
          pageSize={pagination.pageSize}
          total={visibleRows.length}
          onPage={(p) => setPagination((x) => ({ ...x, pageIndex: p }))}
          onPageSize={(n) => setPagination({ pageIndex: 0, pageSize: n })}
        />
      </div>
    </>
  )
}
