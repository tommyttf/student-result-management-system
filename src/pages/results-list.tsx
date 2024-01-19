import { Grid } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Result } from ".prisma/client";
import { trpc } from "@/utils/trpc";
import { useMemo } from "react";
import type { GridColDef } from "@mui/x-data-grid/models/colDef/gridColDef";

export default function ResultsList() {
  const { data: results, refetch, isLoading } = trpc.getAllResults.useQuery();

  const columns = useMemo<GridColDef<Result>[]>(
    () => [
      {
        field: "course.name",
        headerName: "Course",
        flex: 3,
        align: "center",
        headerAlign: "center",
        valueGetter: (params) => params.row.course.name,
      },
      {
        field: "student.name",
        headerName: "Student",
        flex: 3,
        align: "center",
        headerAlign: "center",
        valueGetter: (params) =>
          `${params.row.student.firstName} ${params.row.student.familyName}`,
      },
      {
        field: "score",
        headerName: "Score",
        flex: 2,
        align: "center",
        headerAlign: "center",
      },
    ],
    [],
  );

  return (
    <Grid container style={{ height: 550 }}>
      <DataGrid<Result[]>
        loading={isLoading}
        rows={results ?? []}
        pageSizeOptions={[10, 15, 20, 100]}
        columns={columns}
        getRowId={({ id }) => id}
        showCellVerticalBorder={true}
      />
    </Grid>
  );
}
