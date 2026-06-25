import React, { useState } from "react";
import {
  createTable,
  getCoreRowModel,
  createColumn,
  useTableInstance,
  createGroup,
  createDataColumn,
  getPaginationRowModel,
  getSortedRowModel,
} from "@tanstack/react-table";
import students from "../students.json";
import download from "downloadjs";

const table = createTable();
const defaultData = [...students];

const defaultColumns = [
  table.createGroup({
    id: "Full Name",
    header: "Full Name",
    columns: [
      table.createDataColumn("firstName", {
        id: "First Name",
      }),
      table.createDataColumn("middleName", {
        id: "Middle Name",
      }),
      table.createDataColumn("lastName", {
        id: "Last Name",
      }),
      table.createDataColumn("age", {
        id: "Age",
      }),
    ],
  }),
  table.createGroup({
    header: "Phone Numbers",
    columns: [
      table.createDataColumn((row) => row.phone[1], {
        id: "Phone Number 1",
      }),
      table.createDataColumn((row) => row.phone[2], {
        id: "Phone Number 2",
      }),
    ],
  }),
  table.createDataColumn("email", {
    id: "E-mail Address",
  }),
  table.createGroup({
    header: "Full Address",
    columns: [
      table.createDataColumn((row) => row.address.street, {
        id: "Street",
      }),
      table.createDataColumn((row) => row.address.city, {
        id: "City",
      }),
      table.createDataColumn((row) => row.address.state, {
        id: "State",
      }),
      table.createDataColumn((row) => row.address.pincode, {
        id: "Pin Code",
      }),
    ],
  }),

  table.createGroup({
    header: "Date Details",
    columns: [
      table.createDataColumn("date_of_birth", {
        id: "Date of Birth",
        cell: (props) => new Date(props.getValue()).toDateString(),
      }),
      table.createDataColumn("date_of_admission", {
        id: "Date of Admission",
        cell: (props) => new Date(props.getValue()).toDateString(),
      }),
    ],
  }),
  table.createDisplayColumn({
    id: "action",
    cell: (props) => <DownloadDetails row={props.row} />,
  }),
];

const DownloadDetails = ({ row }) => {
  const data = row.getAllCells().map((cell) => cell.getValue());

  const onClickHandler = () => {
    download(
      data.join("\n"),
      `${data[0]}_${data[1]}_${data[2]}.txt`,
      "text/plain",
    );
  };
  return <button onClick={onClickHandler}>Download Details</button>;
};

const BasicTable = () => {
  const [data, setData] = useState([...defaultData]);
  const [columns, setColumns] = useState([...defaultColumns]);
  const [columnVisibility, setColumnVisibilty] = useState({});
  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const instance = useTableInstance(table, {
    data,
    columns,
    state: {
      pagination,
      columnVisibility,
      sorting,
    },
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibilty,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });
  console.log(instance);
  return (
    <div>
      <div>
        <label>
          <input
            type="checkbox"
            checked={instance.getIsAllColumnsVisible()}
            onChange={instance.getToggleAllColumnsVisibilityHandler()}
          />
          Toggle All Columns
        </label>
        {instance.getAllLeafColumns().map((column) => (
          <label key={column.id}>
            <input
              type="checkbox"
              checked={column.getIsVisible()}
              onChange={column.getToggleVisibilityHandler()}
            />
            {column.id}
          </label>
        ))}
      </div>
      <table border="2">
        <thead>
          {instance.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} colSpan={header.colSpan}>
                  {header.isPlaceholder ? null : (
                    <div onClick={header.column.getToggleSortingHandler()}>{header.renderHeader()}
                    {{asc: " 🔼", desc: " 🔽"}[header.column.getIsSorted()] ?? null}
                    </div>
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {instance.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>{cell.renderCell()}</td>
              ))}
            </tr>
          ))}
        </tbody>
        <tr>
          <td colSpan={columns.length}></td>
        </tr>
        <tfoot>
          {instance.getFooterGroups().map((footerGroup) => (
            <tr key={footerGroup.id}>
              {footerGroup.headers.map((header) => (
                <th key={header.id} colSpan={header.colSpan}>
                  {header.isPlaceholder ? null : header.renderFooter()}
                </th>
              ))}
            </tr>
          ))}
        </tfoot>
      </table>
      <button
        onClick={() => setPagination({ ...pagination, pageIndex: 0 })}
        disabled={!instance.getCanPreviousPage()}
      >
        First Page
      </button>
      <button
        onClick={() => instance.previousPage()}
        disabled={!instance.getCanPreviousPage()}
      >
        Previous Page
      </button>
      <button
        onClick={() => instance.nextPage()}
        disabled={!instance.getCanNextPage()}
      >
        Next Page
      </button>
      <button
        onClick={() => instance.setPageIndex(instance.getPageCount() - 1)}
        disabled={!instance.getCanNextPage()}
      >
        Last Page
      </button>
      <span>
        Page {instance.getState().pagination.pageIndex + 1} of{""}{" "}
        {instance.getPageCount()}
      </span>
      <input
        type="number"
        value={instance.getState().pagination.pageIndex + 1}
        onChange={(e) =>
          setPagination({
            ...pagination,
            pageIndex: parseInt(e.target.value) - 1,
          })
        }
      />
    </div>
  );
};
export default BasicTable;

// import React, { useState } from "react";
// import {
//   createTable,
//   useTableInstance,
//   getCoreRowModel,
// } from "@tanstack/react-table";
// import STUDENTS from "../students.json";

// const table = createTable();
// const defaultData = [...STUDENTS];
// const defaultColumns = [
//   table.createGroup({
//     header: "Full Name",
//     columns: [
//       table.createDataColumn("firstName", {
//         id: "First Name",
//       }),
//       table.createDataColumn("middleName", {
//         id: "Middle Name",
//       }),
//       table.createDataColumn("lastName", {
//         id: "Last Name",
//       }),
//     ],
//   }),
//   table.createDataColumn("age", {
//     id: "Age",
//   }),
//   table.createGroup({
//     header: "Phone Number",
//     columns: [
//       table.createDataColumn((row) => row.phone[1], {
//         id: "Phone Number 1",
//       }),
//       table.createDataColumn((row) => row.phone[2], {
//         id: "Phone Number 2",
//       }),
//     ],
//   }),
//   table.createDataColumn("email", {
//     id: "E-mail Address",
//   }),
//   table.createGroup({
//     header: "Full Address",
//     columns: [
//       table.createDataColumn((row) => row.address.street, {
//         id: "Street",
//       }),
//       table.createDataColumn((row) => row.address.city, {
//         id: "City",
//       }),
//       table.createDataColumn((row) => row.address.state, {
//         id: "Address",
//       }),
//       table.createDataColumn((row) => row.address.pincode, {
//         id: "Pin Code",
//       }),
//     ],
//   }),
//   table.createGroup({
//     header: "Date Details",
//     columns: [
//       table.createDataColumn("date_of_birth", {
//         id: "Date of Birth",
//         cell: (props) => new Date(props.getValue()).toDateString(),
//       }),
//       table.createDataColumn("date_of_admission", {
//         id: "Date of Admission",
//         cell: (props) => new Date(props.getValue()).toDateString(),
//       }),
//     ],
//   }),
// ];
// const BasicTable = () => {
//   const [data, setData] = useState([...defaultData]);
//   const [columns, setColumns] = useState([...defaultColumns]);

//   const instance = useTableInstance(table, {
//     data,
//     columns,
//     getCoreRowModel: getCoreRowModel(),
//   });
//   console.log(instance.getRowModel());
//   return (
//     <div>
//       <table border={1}>
//         <thead>
//           {instance.getHeaderGroups().map((headerGroup) => (
//             <tr key={headerGroup.id}>
//               {headerGroup.headers.map((header) => (
//                 <th key={header.id} colSpan={header.colSpan}>
//                   {header.isPlaceholder ? null : header.renderHeader()}
//                 </th>
//               ))}
//             </tr>
//           ))}
//         </thead>
//         <tbody>
//           {instance.getRowModel().rows.map((row) => (
//             <tr key={row.id}>
//               {row.getVisibleCells().map((cell) => (
//                 <td key={cell.id}>{cell.renderCell()}</td>
//               ))}
//             </tr>
//           ))}
//         </tbody>
//         <tfoot>
//           {instance.getFooterGroups().map((footerGroup) => (
//             <tr key={footerGroup.id}>
//               {footerGroup.headers.map((header) => (
//                 <th key={header.id} colSpan={header.colSpan}>
//                   {header.isPlaceholder ? null : header.renderFooter()}
//                 </th>
//               ))}
//             </tr>
//           ))}
//         </tfoot>
//       </table>
//     </div>
//   );
// };

// export default BasicTable;
