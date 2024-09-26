import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import "@/styles/user/CourseDetails.css";
import axios from "axios";

interface Course {
  _id: string;
  title: string;
  description: string;
  price: number;
  duration: string;
  imageURL: string;
  ownerName: string;
}

export function CourseDetail() {
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [message, setMessage] = useState<string>("");
  const [isError, setIsError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3030/api/v1/course/preview/${id}`
        );

        if (response) {
          setCourse(response.data.data);
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
    fetchCourse();
  }, [id]);

  if (isLoading) {
    return (
      <Layout login="/login" register="/register">
        <div className="flex justify-center items-center min-h-screen">
          <div className="loader"></div>
        </div>
      </Layout>
    );
  }

  if (isError) {
    return (
      <Layout login="/login" register="/register">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
          <p className="text-center text-red-500">{message}</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout login="/login" register="/register">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-x-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 mb-4">
              {course?.title}
            </h1>
            <p className="text-lg text-gray-500 mb-6">{course?.description}</p>
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Course Content
              </h2>
              <ul className="list-disc pl-5 space-y-2"></ul>
            </div>
            <p className="text-lg text-gray-500 mb-6">
              Created by: {course?.ownerName}
            </p>
          </div>
          <div className="mt-10 lg:mt-0">
            <div className="bg-white shadow rounded-lg p-6">
              <img
                src={course?.imageURL}
                alt="course-image"
                className="rounded-xl"
                width={800}
              />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Course Details
              </h2>
              <p className="text-3xl font-bold text-blue-600 mb-2">
                {course?.price} ETH
              </p>
              <p className="text-gray-500 mb-6">Duration: {course?.duration}</p>
              <Link to={`/payment/${course?._id}}`}>
                <Button className="w-full bg-blue-600 text-white hover:bg-blue-700">
                  Enroll Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}