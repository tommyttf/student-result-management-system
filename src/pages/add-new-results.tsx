import { Course, PrismaClient, Student } from "@prisma/client";
import {
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";

import { Result, Score } from ".prisma/client";
import { trpc } from "@/utils/trpc";
import { showMessage } from "@/store/message";
import { useAppDispatch } from "@/store";

interface IProps {
  courses: Course[];
  students: Student[];
}

export async function getStaticProps() {
  const prisma = new PrismaClient();
  const courses = await prisma.course.findMany({
    select: {
      id: true,
      name: true,
    },
    where: {
      isDeleted: false,
    },
  });
  const students = await prisma.student.findMany({
    select: {
      id: true,
      firstName: true,
      familyName: true,
    },
    where: {
      isDeleted: false,
    },
  });

  return {
    props: { courses, students },
  };
}

export default function AddNewResults({ courses, students }: IProps) {
  const {
    handleSubmit,
    reset,
    control,
    register,
    formState: { errors },
  } = useForm<Result>();
  const mutation = trpc.addNewResult.useMutation();
  const dispatch = useAppDispatch();

  const onSubmit = async (result: Result) => {
    const res = await mutation.mutateAsync(result);
    if (res.status === 201) {
      reset();
      dispatch(showMessage({ message: res.message }));
    }
  };

  return (
    <Grid container justifyContent="center">
      <Grid item xs={12} textAlign="center">
        Add New Result
      </Grid>

      <Grid container justifyContent="center" alignItems="center" padding="8px">
        <FormControl sx={{ m: 1, minWidth: 300 }} error={!!errors?.courseId}>
          <InputLabel>Course Name</InputLabel>
          <Controller
            name="courseId"
            control={control}
            defaultValue=""
            rules={{
              required: "Please select course",
            }}
            render={({ field: { onChange, value } }) => (
              <Select value={value} onChange={onChange} label="Course Name">
                {courses.map(({ id, name }) => (
                  <MenuItem key={id} value={id}>
                    {name}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
          <FormHelperText>
            {errors?.courseId ? errors.courseId.message : null}
          </FormHelperText>
        </FormControl>
      </Grid>

      <Grid container justifyContent="center" alignItems="center" padding="8px">
        <FormControl sx={{ m: 1, minWidth: 300 }} error={!!errors?.studentId}>
          <InputLabel>Student Name</InputLabel>
          <Controller
            name="studentId"
            control={control}
            defaultValue=""
            rules={{
              required: "Please select student",
            }}
            render={({ field: { onChange, value } }) => (
              <Select value={value} onChange={onChange} label="Student Name">
                {students.map(({ id, firstName, familyName }) => (
                  <MenuItem key={id} value={id}>
                    {firstName + " " + familyName}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
          <FormHelperText>
            {errors?.studentId ? errors.studentId.message : null}
          </FormHelperText>
        </FormControl>
      </Grid>

      <Grid container justifyContent="center" alignItems="center" padding="8px">
        <FormControl sx={{ m: 1, minWidth: 300 }} error={!!errors?.score}>
          <InputLabel>Score</InputLabel>
          <Controller
            name="score"
            control={control}
            defaultValue=""
            rules={{
              required: "Please select score",
            }}
            render={({ field: { onChange, value } }) => (
              <Select value={value} onChange={onChange} label="Score">
                {Object.keys(Score).map((s) => (
                  <MenuItem key={s} value={s}>
                    {s}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
          <FormHelperText>
            {errors?.score ? errors.score.message : null}
          </FormHelperText>
        </FormControl>
      </Grid>

      <Grid item xs={12}>
        <Stack direction="row" justifyContent="center">
          <Button
            onClick={handleSubmit(onSubmit)}
            variant="contained"
            disableElevation
          >
            Submit
          </Button>
          <Button onClick={reset} variant="outlined">
            Reset
          </Button>
        </Stack>
      </Grid>
    </Grid>
  );
}
