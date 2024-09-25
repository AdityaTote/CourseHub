import React from "react";
import { Link, useParams } from "react-router-dom";
import { Layout } from "../../components/Layout";
import { Button } from "../../components/ui/button";

const course = {
  id: 1,
  title: "Blockchain Fundamentals",
  description:
    "Learn the basics of blockchain technology and its applications.",
  price: 0.1,
  duration: "4 weeks",
  lessons: [
    "Introduction to Blockchain",
    "Cryptography Basics",
    "Consensus Mechanisms",
    "Smart Contracts",
  ],
};

export function CourseDetail() {
  const { id } = useParams<{ id: string }>();

  // In a real application, you would fetch the course data based on the id
  // For this example, we're using a static course object

  return (
    <Layout login="/login" register="/register">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-x-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 mb-4">
              {course.title}
            </h1>
            <p className="text-lg text-gray-500 mb-6">{course.description}</p>
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Course Content
              </h2>
              <ul className="list-disc pl-5 space-y-2">
                {course.lessons.map((lesson, index) => (
                  <li key={index} className="text-gray-600">
                    {lesson}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-10 lg:mt-0">
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Course Details
              </h2>
              <p className="text-3xl font-bold text-blue-600 mb-2">
                {course.price} ETH
              </p>
              <p className="text-gray-500 mb-6">Duration: {course.duration}</p>
              <Link to={`/payment/${id}`}>
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
