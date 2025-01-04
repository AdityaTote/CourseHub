  import { useState } from "react";
  import { Link, useParams } from "react-router-dom";
  import { Layout } from "@/components/Layout";
  import {
    Clock,
    Users,
  } from "lucide-react";
  import { useFetch } from "@/hooks/useFetch";
  import { BACKEND_URL } from "@/utils";

  export function CourseDetail() {
    const { id } = useParams<{ id: string }>();
    const [activeTab, setActiveTab] = useState("overview");

    const { data, loading, error } = useFetch(
      `${BACKEND_URL}/api/v1/course/preview/${id}`,
      false
    );

    const TabButton = ({ name, label, active }) => (
      <button
        onClick={() => setActiveTab(name)}
        className={`px-4 py-2 font-medium rounded-lg transition-colors
          ${
            active ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-50"
          }`}
      >
        {label}
      </button>
    );

    const renderContentSection = (content) => {
      if (!content) return null;

      return (
        <div className="space-y-4">
            <div
              className="border rounded-lg p-4 hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between mb-2">
              <p  className="text-gray-700 leading-relaxed">
                  {content}
                </p>
              </div>
            </div>
        </div>
      );
    };

    const renderDescription = (about) => {
      if (!data) return null;
      console.log(data)
      return (
        <div className="bg-white rounded-lg border p-6 space-y-6">
          <div className="border-l-4 border-blue-500 pl-4">
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              About This Course
            </h2>
            <div className="space-y-4">
                <p  className="text-gray-700 leading-relaxed">
                  {about}
                </p>
            </div>
          </div>
        </div>
      );
    };

    if (loading) {
      return (
        <Layout>
          <div className="flex justify-center items-center min-h-screen">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </Layout>
      );
    }

    if (error) {
      return (
        <Layout>
          <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
            <p className="text-center text-red-500">{error}</p>
          </div>
        </Layout>
      );
    }

    if (data) {
      return (
        <Layout>
          <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
            <div className="lg:grid lg:grid-cols-2 lg:gap-x-36">
              {/* Left Column - Course Content */}
              <div className="space-y-8">
                {/* Course Header */}
                <div>
                  <h1 className="text-3xl font-extrabold text-gray-900 mb-4">
                    {data.title}
                  </h1>
                  {/* Tab Navigation */}
                  <div className="flex space-x-2 mb-6">
                    <TabButton
                      name="overview"
                      label="Overview"
                      active={activeTab === "overview"}
                    />
                    <TabButton
                      name="content"
                      label="Course Content"
                      active={activeTab === "content"}
                    />
                    <TabButton
                      name="instructor"
                      label="Instructor"
                      active={activeTab === "instructor"}
                    />
                  </div>

                  {/* Tab Content */}
                  <div className="space-y-6">
                    {activeTab === "overview" && (
                      <>
                        {renderDescription(data.about)}
                        <div className="bg-white rounded-lg border p-6">
                          <h2 className="text-xl font-bold text-gray-900 mb-4">
                            What You'll Learn
                          </h2>
                            {renderContentSection(data.learning)}
                        </div>
                      </>
                    )}

                    {activeTab === "content" && (
                      <div className="bg-white rounded-lg border p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">
                          Course Content
                        </h2>
                        {renderContentSection(data.learning)}
                      </div>
                    )}

                    {activeTab === "instructor" && (
                      <div className="bg-white rounded-lg border p-6">
                        <div className="flex items-start gap-4">
                          {data.creater?.avatarURL && (
                            <img
                              src={data.creater.avatarURL}
                              alt={`${data.creater.firstName} ${data.creater.lastName}`}
                              className="w-20 h-20 rounded-full object-cover"
                            />
                          )}
                          <div>
                            <h2 className="text-xl font-bold text-gray-900 mb-2">
                              {data.creater?.firstName} {data.creater?.lastName}
                            </h2>
                            <p className="text-gray-700">{data.creater?.bio}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Course Details Card */}
              <div className="mt-8 lg:mt-0">
                <div className="bg-white rounded-lg border shadow-sm sticky top-8">
                  {data.imageURL && (
                    <img
                      src={data.imageURL}
                      alt="course-image"
                      className="w-full h-[280px] object-cover rounded-t-lg"
                    />
                  )}
                  <div className="p-6 space-y-6">
                    <div className="flex items-center justify-between">
                      <p className="text-3xl font-bold text-blue-600">
                        $ {data.price}
                      </p>
                      {data.originalPrice && (
                        <p className="text-lg text-gray-500 line-through">
                          $ {data.originalPrice}
                        </p>
                      )}
                    </div>

                    {/* Course Stats */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2 bg-gray-50 p-3 rounded-lg">
                        <Clock className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="text-sm text-gray-500">Duration</p>
                          <p className="font-medium">
                            {data.duration || "Self-paced"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 bg-gray-50 p-3 rounded-lg">
                        <Users className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="text-sm text-gray-500">Students</p>
                          <p className="font-medium">
                            {data.studentsEnrolled || 0}
                          </p>
                        </div>
                      </div>
                    </div>
                    {/* Enroll Button */}
                    <div className="space-y-4">
                      <Link to={`/payment/${data.id}`}>
                        <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                          Enroll Now
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Layout>
      );
    }
  }
