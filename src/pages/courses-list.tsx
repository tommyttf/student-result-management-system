import { Course } from "@prisma/client";

import { useMemo } from "react";
import { Grid } from "@mui/material";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import CloseIcon from "@mui/icons-material/Close";
import type { GridColDef } from "@mui/x-data-grid/models/colDef/gridColDef";

import { trpc } from "@/utils/trpc";

type GridRowType = Pick<Course, "id" | "name">;
export default function CoursesList() {
  const { data: courses, refetch, isLoading } = trpc.getAllCourses.useQuery();
  const mutation = trpc.deleteCourse.useMutation();

  const columns = useMemo<GridColDef<GridRowType>[]>(
    () => [
      {
        field: "name",
        headerName: "Course Name",
        flex: 3,
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
                  `Are you sure to delete the course "${params.row.name}"?`,
                )
              ) {
                const result = await mutation.mutateAsync({
                  id: Number(params.id),
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
      <DataGrid<GridRowType>
        loading={isLoading}
        rows={courses ?? []}
        pageSizeOptions={[10, 15, 20, 100]}
        columns={columns}
        getRowId={({ id }) => id}
        showCellVerticalBorder={true}
      />
    </Grid>
  );
}
