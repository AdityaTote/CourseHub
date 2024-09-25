import React from "react";
import { Link } from "react-router-dom";
import { Layout } from "../../components/Layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import useUserAuth from "@/hooks/useUserAuth";

const courses = [
  {
    id: 1,
    title: "Blockchain Fundamentals",
    description:
      "Learn the basics of blockchain technology and its applications.",
    price: 0.1,
    duration: "4 weeks",
  },
  {
    id: 2,
    title: "Cryptocurrency Trading",
    description:
      "Master the art of trading cryptocurrencies in volatile markets.",
    price: 0.15,
    duration: "6 weeks",
  },
  {
    id: 3,
    title: "Smart Contract Development",
    description:
      "Build and deploy smart contracts on Ethereum and other platforms.",
    price: 0.2,
    duration: "8 weeks",
  },
];

export function Courses() {
  const { isAuthenticated } = useUserAuth();

  return (
    <Layout login="/login" register="/register">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8">
          Available Courses
        </h1>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <Card key={course.id}>
              <CardHeader>
                <CardTitle>{course.title}</CardTitle>
                <CardDescription>{course.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-blue-600">
                  {course.price} ETH
                </p>
                <p className="text-sm text-gray-500">
                  Duration: {course.duration}
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
          ))}
        </div>
      </div>
    </Layout>
  );
}
