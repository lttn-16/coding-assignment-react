import { forwardRef, useImperativeHandle, useRef } from "react";
import { Ticket } from "@acme/shared-models";
import { AgGridReact } from "ag-grid-react";
import { useMemo } from "react";
import { ColDef, ColGroupDef } from "ag-grid-community";
import { Badge } from "antd";

interface ITableProps {
    data: Ticket[];
    loading?: boolean;
}

export interface TableRef {
    getSelectedRows: () => Ticket[];
    clearSelection: () => void;
}

const Table = forwardRef<TableRef, ITableProps>(({ data, loading }, ref) => {
    const gridRef = useRef<AgGridReact<Ticket>>(null);

    useImperativeHandle(ref, () => ({
        getSelectedRows: () => gridRef.current?.api.getSelectedRows() ?? [],
        clearSelection: () => gridRef.current?.api.deselectAll(),
    }));

    const columnDefs: (ColDef<Ticket, any> | ColGroupDef<Ticket> | any)[] =
        useMemo(() => {
            return [
                { field: "id", headerName: "ID", width: 70 },
                {
                    field: "description",
                    headerName: "Description",
                    width: 200,
                    flex: 1,
                },
                {
                    field: "assigneeName",
                    headerName: "Assignee Name",
                    width: 250,
                },
                {
                    field: "completed",
                    headerName: "Complete Status",
                    width: 200,
                    cellRenderer: (params: { value: boolean }) => (
                        <Badge
                            status={params.value ? "success" : "processing"}
                            text={params.value ? "Completed" : "Incomplete"}
                        />
                    ),
                },
            ];
        }, []);

    return (
        <div style={{ width: "100%", height: "500px" }}>
            <AgGridReact
                ref={gridRef}
                columnDefs={columnDefs}
                rowData={data}
                loading={loading}
                rowSelection={{
                    mode: "multiRow",
                }}
            />
        </div>
    );
});

export default Table;
