import { Grid } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { trpc } from "@/utils/trpc";
import { useMemo } from "react";
import type { GridColDef } from "@mui/x-data-grid/models/colDef/gridColDef";
import { Prisma } from "@prisma/client";

type GridRowType = Omit<
  Prisma.ResultGetPayload<{
    include: {
      course: {
        select: {
          name: true;
        };
      };
      student: {
        select: {
          firstName: true;
          familyName: true;
        };
      };
    };
  }>,
  "courseId" | "studentId" | "createdAt" | "updatedAt"
>;
export default function ResultsList() {
  const { data: results, isLoading } = trpc.getAllResults.useQuery();

  const columns = useMemo<GridColDef<GridRowType>[]>(
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
      <DataGrid<GridRowType>
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
