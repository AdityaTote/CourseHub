import React, { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PencilIcon, TrashIcon } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";

export function AdminManageCourses() {
  const [courses, setCourses] = useState();
  const [editingCourse, setEditingCourse] = useState(null);
  const [message, setMessage] = useState<string>("");
  const [isError, setIsError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3030/api/v1/admin/courses",
          {
            withCredentials: true,
          }
        );
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

  const handleEdit = (course) => {
    setEditingCourse(course);
  };

  const handleDelete = async (courseId) => {
    try {
      console.log(courseId);
      await axios.delete(
        `http://localhost:3030/api/v1/admin/courses/${courseId}`,
        {
          withCredentials: true,
        }
      );
      setCourses(courses.filter((course) => course.id !== courseId));
    } catch (error: any) {
      console.log(error.response.data.error);
      setMessage(error.response.data.error);
      setIsError(true);
    }
  };

  const handleSave = async (updatedCourse) => {
    try {
      const response = await axios.put(
        `http://localhost:3030/api/v1/admin/courses/${updatedCourse.id}`,
        updatedCourse,
        {
          withCredentials: true,
        }
      );
      setCourses(
        courses.map((course) =>
          course.id === updatedCourse.id ? updatedCourse : course
        )
      );
      setEditingCourse(null);
      setMessage(response.data.message);
      setIsError(false);
    } catch (error: any) {
      console.log(error.response.data.error);
      setMessage(error.response.data.error);
      setIsError(true);
    }
  };

  if (isLoading) {
    return (
      <Layout login="/admin/login" register="/admin/register">
        <div className="flex justify-center items-center min-h-screen">
          <div className="loader"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout login="/admin/login" register="/admin/register">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">
            Manage Courses
          </h1>
          <Button className="bg-blue-600 text-white hover:bg-blue-700">
            <Link to="/admin/add-course">Add New Course</Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <Card key={course.id} className="flex flex-col justify-between">
              <CardHeader>
                <CardTitle>{course.title}</CardTitle>
                <CardDescription>
                  {showDecription(course.description)}
                </CardDescription>
              </CardHeader>
              <img src={ course.imageURL } alt="course-image" className="rounded-xl" width={400} />
              <CardContent>
                <p className="text-2xl font-bold text-blue-600">
                  {course.price}
                </p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      onClick={() => handleEdit(course)}
                    >
                      <PencilIcon className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Course</DialogTitle>
                      <DialogDescription>
                        Make changes to the course details here.
                      </DialogDescription>
                    </DialogHeader>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleSave({
                          ...editingCourse,
                          title: e.target.title.value,
                          description: e.target.description.value,
                          price: parseFloat(e.target.price.value),
                          duration: e.target.duration.value,
                        });
                      }}
                    >
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="title">Title</Label>
                          <Input
                            id="title"
                            defaultValue={editingCourse?.title}
                          />
                        </div>
                        <div>
                          <Label htmlFor="description">Description</Label>
                          <Textarea
                            id="description"
                            defaultValue={editingCourse?.description}
                          />
                        </div>
                        <div>
                          <Label htmlFor="price">Price (ETH)</Label>
                          <Input
                            id="price"
                            type="number"
                            step="0.01"
                            defaultValue={editingCourse?.price}
                          />
                        </div>
                        <div>
                          <Label htmlFor="duration">Duration</Label>
                          <Input
                            id="duration"
                            defaultValue={editingCourse?.duration}
                          />
                        </div>
                      </div>
                      <DialogFooter className="mt-6">
                        <Button type="submit">Save changes</Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
                <Button
                  variant="destructive"
                  onClick={() => handleDelete(course.id)}
                >
                  <TrashIcon className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
}
