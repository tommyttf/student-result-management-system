import { Course } from "@prisma/client";

import { useMemo } from "react";
import { Grid } from "@mui/material";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import type { GridColDef } from "@mui/x-data-grid/models/colDef/gridColDef";

import { trpc } from "@/utils/trpc";

export default function CoursesList() {
  const { data: courses, refetch, isLoading } = trpc.getAllCourses.useQuery();
  const mutation = trpc.deleteCourse.useMutation();

  const columns = useMemo<GridColDef<Course>[]>(
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
            icon={<DeleteIcon />}
            label="Delete"
            onClick={async () => {
              if (
                confirm(
                  `Are you sure to delete the course "${params.row.name}"?`,
                )
              ) {
                const result = await mutation.mutateAsync({
                  id: params.id,
                });
                if (result.status === 201) {
                  refetch();
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
      <DataGrid<Course[]>
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
