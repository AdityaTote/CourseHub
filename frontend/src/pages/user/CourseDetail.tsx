import { Link, useParams } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import "@/styles/user/CourseDetails.css";
import { useFetch } from "@/hooks/useFetch";
import { BACKEND_URL } from "@/utils";

export function CourseDetail() {
  const { id } = useParams<{ id: string }>();

  const { data, loading, error } = useFetch(`${BACKEND_URL}/api/v1/course/preview/${id}`, false);

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="loader"></div>
        </div>
      </Layout>
    );
  } else if (error) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
          <p className="text-center text-red-500">{error}</p>
        </div>
      </Layout>
    );
  } else if(data){

    return (
      <Layout>
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-x-8">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 mb-4">
                {data?.title}
              </h1>
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  Course Content
                </h2>
                <ul className="list-disc pl-5 space-y-2"></ul>
              </div>
              <pre className="text-lg text-gray-500 mb-6 whitespace-pre-wrap font-sans">{data?.description}</pre>
              <p className="text-lg text-gray-900 mb-6 whitespace-pre-line font-bold">
                Created by: {data?.creater.firstName + " " + data?.creater.lastName}
              </p>
            </div>
            <div className="mt-10 lg:mt-0">
              <div className="bg-white shadow rounded-lg p-6">
                <img
                  src={data?.imageURL}
                  alt="course-image"
                  className="rounded-xl"
                  width={800}
                />
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Course Details
                </h2>
                <p className="text-3xl font-bold text-blue-600 mb-2">
                 $ {data?.price}
                </p>
                <Link to={`/payment/${data?.id}`}>
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

}