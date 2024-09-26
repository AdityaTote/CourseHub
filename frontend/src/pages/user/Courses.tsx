import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
import axios from "axios";

export function Courses() {
  const [courses, setCourses] = useState(null);
  const [message, setMessage] = useState<string>("");
  const [isError, setIsError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get("http://localhost:3030/api/v1/course/preview");

        if (response) {
          setCourses(response.data.data);
          setMessage(response.data.message);
          setIsError(false);
        } else {
          setMessage(response.data.error);
          setIsError(true);
        }
      } catch (error: any) {
        console.log(error.response.data.error);
        setMessage(error.response.data.error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const showDecription = (description) => {
    return description.slice(0, 100);
  };

  if (isLoading) {
    return (
      <Layout login="/login" register="/register">
        <div className="flex justify-center items-center min-h-screen">
          <div className="loader"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout login="/login" register="/register">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8">
          Available Courses
        </h1>
        {courses && courses.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <Card key={course.id}>
                <CardHeader>
                  <CardTitle>{course.title}</CardTitle>
                  <CardDescription>{showDecription(course.description)}</CardDescription>
                </CardHeader>
                <img src={course.imageURL} alt="course-image"  width={400} />
                <CardContent>
                  <p className="text-2xl font-bold text-blue-600">
                    {course.price}
                  </p>
                </CardContent>
                <CardFooter>
                  <Link to={`/courses/${course._id}`} className="w-full">
                    <Button className="w-full bg-blue-600 text-white hover:bg-blue-700">
                      View Course
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex justify-center items-center min-h-[50vh]">
            <p className="text-xl text-gray-500">No courses available</p>
          </div>
        )}
      </div>
    </Layout>
  );
}