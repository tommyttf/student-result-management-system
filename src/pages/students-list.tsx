import { trpc } from "@/utils/trpc";
import { useMemo } from "react";
import { Student } from "@prisma/client";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import CloseIcon from "@mui/icons-material/Close";
import type { GridColDef } from "@mui/x-data-grid/models/colDef/gridColDef";
import { format } from "date-fns";
import { Grid } from "@mui/material";

export default function StudentsList() {
  const { data: students, refetch, isLoading } = trpc.getAllStudents.useQuery();
  const mutation = trpc.deleteStudent.useMutation();

  const columns = useMemo<GridColDef<Student>[]>(
    () => [
      {
        field: "Name & Family name",
        headerName: "Name & Family name",
        flex: 2,
        align: "center",
        headerAlign: "center",
        valueGetter: (params) =>
          `${params.row.firstName} ${params.row.familyName}`,
      },
      {
        field: "dateOfBirth",
        headerName: "DOB",
        flex: 3,
        align: "center",
        headerAlign: "center",
        valueFormatter: ({ value }) => format(value, "MM/dd/yyyy"),
      },
      {
        field: "email",
        headerName: "Email",
        flex: 4,
        align: "center",
        headerAlign: "center",
      },
      {
        field: "delete",
        headerName: "Delete",
        type: "actions",
        flex: 1,
        align: "center",
        headerAlign: "center",
        getActions: (params) => [
          <GridActionsCellItem
            key="delete"
            icon={<CloseIcon />}
            label="Delete"
            onClick={async () => {
              if (
                confirm(
                  `Are you sure to remove the student "${params.row.firstName} ${params.row.familyName}"?`,
                )
              ) {
                const result = await mutation.mutateAsync({
                  id: params.id,
                });
                if (result.status === 201) {
                  await refetch();
                }
              }
            }}
          />,
        ],
      },
    ],
    [mutation, refetch],
  );

  return (
    <Grid container style={{ height: 550 }}>
      <DataGrid<Student[]>
        loading={isLoading}
        rows={students ?? []}
        pageSizeOptions={[10, 15, 20, 100]}
        columns={columns}
        getRowId={({ id }) => id}
        showCellVerticalBorder={true}
      />
    </Grid>
  );
}
