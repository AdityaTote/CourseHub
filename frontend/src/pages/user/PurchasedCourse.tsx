import { Link, useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BACKEND_URL } from "@/utils";
import { CourseSkeleton } from "@/components/CourseSkeleton";
import { useFetch } from "@/hooks/useFetch";
import useUserAuth from "@/hooks/useUserAuth";
import { UserCourse } from "@/types";

export function PurchasedCourse() {
  const { data, loading, error } = useFetch(
    `${BACKEND_URL}/api/v1/user/courses`,
    true
  );
  const { isAuthenticated } = useUserAuth();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    navigate("/user/login");
  }

  if (loading) {
    return (
      <Layout>
        <CourseSkeleton />;
      </Layout>
    );
  } else if (data) {
    return (
      <Layout>
        <CourseDisplay data={data} />
      </Layout>
    );
  } else if (error) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[50vh]">
          <p className="text-xl text-gray-500">Something went wrong</p>
        </div>
      </Layout>
    );
  } else {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[50vh]">
          <p className="text-xl text-gray-500">No courses Purchased</p>
        </div>
      </Layout>
    );
  }
}

function CourseDisplay({ data }: { data: UserCourse[] }) {
  return (
    <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Purchased Courses</h1>
      {data && data.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((course: UserCourse) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      ) : (
        <div className="flex justify-center items-center min-h-[50vh]">
          <p className="text-xl text-gray-500">No courses available</p>
        </div>
      )}
    </div>
  );
}

function CourseCard({ course }: { course: UserCourse }) {
  const showDescription = (description: string) => {
    return description.slice(0, 100);
  };
  return (
    <Link to={`/courses/${course.id}`}>
      <Card key={course.id}>
        <CardHeader>
          <CardTitle>{course.title}</CardTitle>
          <CardDescription>
            {showDescription(course.description)}
          </CardDescription>
        </CardHeader>
        <div className="400">
          <img
            src={course.imageURL}
            alt="course-image"
            // width={400}
            className="h-64 w-400 object-cover mx-auto"
          />
        </div>
        <CardContent>
          <p className="text-2xl font-bold text-blue-600">$ {course.price}</p>
          <p className="text-sm text-gray-500 py-2">
            Created by: {course?.creater?.firstName} {course?.creater?.lastName}
          </p>
        </CardContent>
        <CardFooter>
          <Link to={`/courses/${course.id}`} className="w-full">
            <Button className="w-full bg-blue-600 text-white hover:bg-blue-700">
              View Course
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </Link>
  );
}