import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Layout } from "../../components/Layout";
import { Button } from "../../components/ui/button";
import useUserAuth from "@/hooks/useUserAuth";
import axios from "axios";

// const course = {
//   id: 1,
//   title: "Blockchain Fundamentals",
//   description:
//     "Learn the basics of blockchain technology and its applications.",
//   price: 0.1,
//   duration: "4 weeks",
//   lessons: [
//     "Introduction to Blockchain",
//     "Cryptography Basics",
//     "Consensus Mechanisms",
//     "Smart Contracts",
//   ],
// };

export function CourseDetail() {

  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = React.useState();
  const [ message, setMessage ] = React.useState<string>("");
  const [ isError, setIsError ] = React.useState<boolean>(false);

  useEffect(() => {
    const fetchCourse = async() => {
      try {
        const response = await axios.get(`http://localhost:3030/api/v1/course/${id}`);
  
        if(response){
          setCourse(response.data.data)
          setMessage(response.data.message)
          setIsError(false)
        } else {
          setMessage(response.data.error)
          setIsError(true)
        }
      } catch (error: any) {
        console.log(error.response.data.error);
        setMessage(error.response.data.error);
        setIsError(true);
      }
    }
    fetchCourse()
  }, [])

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
