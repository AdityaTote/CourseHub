import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import useAdminAuth from "@/hooks/useAdminAuth";
import axios, { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL, CLOUDFRONT_URL } from "@/utils";
import { AdminLayout } from "@/components/AdminLayout";

export function AddCourse() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAdminAuth();
  const [imgUrl, setImgUrl] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [isError, setIsError] = useState<boolean>(false);
  const titleRef = useRef<HTMLInputElement>(null);
  const aboutRef = useRef<HTMLTextAreaElement>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const learningRef = useRef<HTMLTextAreaElement>(null);
  const priceRef = useRef<HTMLInputElement>(null);

  if (!isAuthenticated) {
    navigate("/admin/login");
  }

  const handleFileChange = async(e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0];
      const response = await axios.get(`${BACKEND_URL}/api/v1/presignedUrl`, {
        withCredentials: true,
      });
      const presignedUrl = response.data.preSignedUrl;
      const formData = new FormData();
      formData.set("bucket", response.data.fields["bucket"])
      formData.set("X-Amz-Algorithm", response.data.fields["X-Amz-Algorithm"]);
      formData.set("X-Amz-Credential", response.data.fields["X-Amz-Credential"]);
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
      const urlPath = `${CLOUDFRONT_URL}/${response.data.fields["key"]}`
      setImgUrl(urlPath)
  } catch(e) {
      console.log(e)
  }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/v1/admin/course`,
        {
          title: titleRef.current?.value,
          about: aboutRef.current?.value,
          content: contentRef.current?.value,
          learning: learningRef.current?.value,
          price: priceRef.current?.value || "0",
          imageURL: imgUrl,
        },
        {
          withCredentials: true,
        }
      );

      if (response) {
        setMessage("Course added successfully.");
        setIsError(false);
        setImgUrl("");
        setTimeout(() => {
          navigate("/admin/manage-courses")
        }, 1000);
      } else {
        setMessage("An error occurred while adding the course.");
        setIsError(true);
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        const errorMessage = error.response?.data?.error || "An error occurred while adding the course.";
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
        setMessage("An error occurred while adding the course.");
        setIsError(true);
      }
    }
  };

  return (
    <AdminLayout >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8">
          Add New Course
        </h1>
        {message && (
          <Alert
            className={`mb-6 ${
              isError
                ? "bg-red-100 text-red-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            <AlertTitle>{isError ? "Error" : "Success"}</AlertTitle>
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}
        <form
          onSubmit={handleSubmit}
          className="space-y-6 bg-white shadow rounded-lg p-8"
        >
          <div>
            <Label htmlFor="title">Course Title</Label>
            <Input
              id="title"
              name="title"
              required
              placeholder="Enter course title"
              className="mt-1"
              ref={titleRef}
            />
          </div>
          <div>
            <Label htmlFor="about">About Course</Label>
            <Textarea
              id="about"
              name="about"
              required
              placeholder="Enter course about"
              className="mt-1"
              ref={aboutRef}
            />
          </div>
          <div>
            <Label htmlFor="content">Course Content</Label>
            <Textarea
              id="content"
              name="content"
              required
              placeholder="Enter course content"
              className="mt-1"
              ref={contentRef}
            />
          </div>
          <div>
            <Label htmlFor="learning">What You’ll Learn</Label>
            <Textarea
              id="learning"
              name="learning"
              required
              placeholder="Enter course learning"
              className="mt-1"
              ref={learningRef}
            />
          </div>
          <div>
            <Label htmlFor="price">Price (in $)</Label>
            <Input
              id="price"
              name="price"
              required
              placeholder="Entre Price in Dollars"
              className="mt-1"
              ref={priceRef}
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
          <div>
            <Button
              type="submit"
              className="w-full bg-blue-600 text-white hover:bg-blue-700"
            >
              Add Course
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
