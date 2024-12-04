import { useState } from "react";
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
import { PencilIcon } from "lucide-react";
import { Link } from "react-router-dom";
import axios, { AxiosError } from "axios";
import { useFetch } from "@/hooks/useFetch";
import { BACKEND_URL, CLOUDFRONT_URL } from "@/utils";
import { CourseSkeleton } from "@/components/CourseSkeleton";
import { AdminLayout } from "@/components/AdminLayout";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Course } from "@/types";



export function AdminManageCourses() {
  const { data, loading, error } = useFetch(
    `${BACKEND_URL}/api/v1/admin/courses`,
    true
  );

  if (loading) {
    return <CourseSkeleton />;
  } else if (error) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="loader"></div>
        </div>
      </AdminLayout>
    );
  } else if (data) {
    return (
      <AdminLayout>
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-10 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-extrabold text-gray-900">
              Manage Courses
            </h1>
            <Button className="bg-blue-600 text-white hover:bg-blue-700">
              <Link to="/admin/add-course">Add New Course</Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {data &&
              data.map((course: Course) => (
                <Courses key={course.id} course={course} />
              ))}
          </div>
        </div>
      </AdminLayout>
    );
  }
}

function Courses({ course }: { course: Course }) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [isError, setIsError] = useState<boolean>(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [imgUrl, setImgUrl] = useState<string>("");

  const showDecription = (description: string) => {
    return description.slice(0, 100);
  };

  const handleEdit = async (course: Course) => {
    setTitle(course.title);
    setDescription(course.description);
    setPrice(course.price);
    setIsDialogOpen(true);
  };

  // const handleDelete = async (courseId: string) => {

  // };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0];
      const response = await axios.get(`${BACKEND_URL}/api/v1/presignedUrl`, {
        withCredentials: true,
      });
      const presignedUrl = response.data.preSignedUrl;
      const formData = new FormData();
      formData.set("bucket", response.data.fields["bucket"]);
      formData.set("X-Amz-Algorithm", response.data.fields["X-Amz-Algorithm"]);
      formData.set(
        "X-Amz-Credential",
        response.data.fields["X-Amz-Credential"]
      );
      formData.set("X-Amz-Date", response.data.fields["X-Amz-Date"]);
      formData.set("key", response.data.fields["key"]);
      formData.set("Policy", response.data.fields["Policy"]);
      formData.set("X-Amz-Signature", response.data.fields["X-Amz-Signature"]);
      if (file) {
        formData.append("file", file);
      }
      const awsResponse = await axios.post(presignedUrl, formData);
      if (!awsResponse) {
        throw new Error("Failed to upload image to S3");
      }
      const urlPath = `${CLOUDFRONT_URL}/${response.data.fields["key"]}`;
      setImgUrl(urlPath);
    } catch (e) {
      console.log(e);
    }
  };

  const handleSave = async (updatedCourse: {
      id: string;
      title?: string;
      description?: string;
      price?: string;
      imageURL?: string;
    }) => {
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("imageURL", imgUrl);

      const response = await axios.patch(
        `${BACKEND_URL}/api/v1/admin/course/${updatedCourse.id}`,
        formData,
        {
          withCredentials: true,
        }
      );

      if (response) {
        console.log(response.data);
        setMessage(response.data.message);
        setCourses(
          courses.map((course) =>
            course.id === updatedCourse.id
              ? { ...course, ...updatedCourse }
              : course
          )
        );
        setIsError(false);
        setIsDialogOpen(false);
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        const errorMessage = error.response?.data?.error || "An error occurred.";
        console.log(errorMessage);
        setMessage(errorMessage);
        setIsError(true);
      } else if (error instanceof Error) {
        // Generic Error handling
        console.log(error.message);
        setMessage(error.message);
        setIsError(true);
      } else {
        // Fallback for unknown error types
        console.log("Unexpected error", error);
        setMessage("An unexpected error occurred.");
        setIsError(true);
      }
    }
  };
  return (
    <div>
      {message && (
        <Alert variant={isError ? "destructive" : "default"} className="mb-4">
          <AlertTitle>{isError ? "Error" : "Success"}</AlertTitle>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}
      <Card key={course.id} className="flex flex-col justify-between">
        <CardHeader>
          <CardTitle>{course.title}</CardTitle>
          <CardDescription>
            {showDecription(course.description)}
          </CardDescription>
        </CardHeader>
        <img
          src={course.imageURL}
          alt="course-image"
          className="rounded-xl"
          width={400}
        />
        <CardContent>
          <div className="text-2xl font-bold text-blue-600 ">
            $ {course.price}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" onClick={() => handleEdit(course)}>
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
                  console.log(course);
                  handleSave(course);
                }}
              >
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="price">Price ($)</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="file">Course Image</Label>
                    <Input
                      id="file"
                      name="file"
                      type="file"
                      accept="image/*"
                      required
                      className="mt-1"
                      onChange={handleFileChange}
                    />
                  </div>
                  <div></div>
                </div>
                <DialogFooter className="mt-6">
                  <Button type="submit">Save changes</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
          <Button variant={"destructive"}>Delete</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
