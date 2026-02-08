"use client";

import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

export function DataTable({
  data,
  columns,
  tableStyle,
  // optional pagination props
  pagination: externalPagination,
  onPaginationChange,
  pageSizeOptions = [10, 20, 50, 10000],
  showPagination = true,
}) {
  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [rowSelection, setRowSelection] = React.useState({});

  // internal pagination state when component is uncontrolled
  const [internalPagination, setInternalPagination] = React.useState({
    pageIndex: externalPagination?.pageIndex ?? 0,
    pageSize: externalPagination?.pageSize ?? pageSizeOptions[3],
  });

  // decide whether pagination is controlled externally
  const isControlledPagination = Boolean(externalPagination);
  const paginationState = isControlledPagination
    ? externalPagination
    : internalPagination;

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: (updater) => {
      const next =
        typeof updater === "function" ? updater(paginationState) : updater;
      if (onPaginationChange) {
        onPaginationChange(next);
      } else {
        setInternalPagination(next);
      }
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination: paginationState,
    },
    initialState: {
      pagination: {
        pageIndex: paginationState?.pageIndex ?? 0,
        pageSize: paginationState?.pageSize ?? pageSizeOptions[0],
      },
    },
  });

  return (
    <div className="overflow-hidden bg-[#fafafa] rounded-md border border-[#f1f1f159]">
      {/* Table Header */}
      <div className="bg-[#4e4d4d18] flex justify-between border-b border-[#f1f1f159] py-2">
        {table.getHeaderGroups().map((headerGroup) => (
          <div key={headerGroup.id} className="contents">
            {headerGroup.headers.map((header) => (
              <div
                key={header.id}
                className="px-4 py-2 flex-1 font-medium text-sm text-]"
              >
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Table Body */}
      <div>
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => (
            <div
              key={row.id}
              data-state={row.getIsSelected() ? "selected" : undefined}
              className={`flex justify-between  first:border-t-0 first:mt-0  border-[#f1f1f159]  hover:bg-transparent cursor-pointer   last:border-b-0 last:mb-0 ${
                tableStyle == "style2" ? "border-b " : "border-t my-1"
              }`}
            >
              {row.getVisibleCells().map((cell) => (
                <div
                  key={cell.id}
                  className="px-4 py-2 flex-1 text-sm text-black self-center"
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </div>
              ))}
            </div>
          ))
        ) : (
          <div className="grid grid-cols-1">
            <div className="h-24 flex items-center justify-center text-gray-400 text-sm">
              No results.
            </div>
          </div>
        )}
      </div>
      {/* Pagination Controls */}
      {/* {showPagination && (
        <div className="flex flex-col md:flex-row items-center justify-between gap-2 p-3 border-t border-[#f1f1f159] bg-[#0f0f0f]">
          <div className="text-sm text-]">
            {(() => {
              const { pageIndex, pageSize } = table.getState().pagination;
              const from = pageIndex * pageSize + 1;
              const to = Math.min((pageIndex + 1) * pageSize, data?.length ?? 0);
              const total = data?.length ?? 0;
              return `${from > total ? 0 : from} - ${to} of ${total}`;
            })()}
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <button
                className="px-3 py-1 bg-gray-700 text-gray-100 rounded disabled:opacity-50"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Prev
              </button>
              <button
                className="px-3 py-1 bg-gray-700 text-gray-100 rounded disabled:opacity-50"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Next
              </button>
            </div>

            <div className="flex items-center space-x-2 text-sm text-]">
              <span>Page</span>
              <strong>
                {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
              </strong>
            </div>

            <div className="flex items-center space-x-2">
              <select
                className="bg-[#1a1a1a] text-gray-200 px-2 py-1 rounded"
                value={table.getState().pagination.pageSize}
                onChange={(e) => table.setPageSize(Number(e.target.value))}
              >
                {pageSizeOptions.map((s) => (
                  <option key={s} value={s}>
                    Show {s}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )} */}
    </div>
  );
}
export default DataTable;
