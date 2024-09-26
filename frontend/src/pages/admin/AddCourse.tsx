import React, { useState } from "react";
import { Layout } from "../../components/Layout";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "../../components/ui/alert";
import useAdminAuth from "@/hooks/useAdminAuth";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export function AddCourse() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAdminAuth();
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string>("");
  const [isError, setIsError] = useState<boolean>(false);

  if (!isAuthenticated) {
    navigate("/admin/login");
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setMessage("Please select an image to upload.");
      setIsError(true);
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("coverImg", file);

    try {
      const response = await axios.post(
        "http://localhost:3030/api/v1/admin/course",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      if (response) {
        setMessage("Course added successfully.");
        setIsError(false);
        setTitle("");
        setDescription("");
        setFile(null);
        setTimeout(() => {
          navigate("/admin")
        }, 1000);
      } else {
        setMessage("An error occurred while adding the course.");
        setIsError(true);
      }
    } catch (error: any) {
      console.log(error.response?.data?.error);
      setMessage(
        error.response?.data?.error ||
          "An error occurred while adding the course."
      );
      setIsError(true);
    }
  };

  return (
    <Layout login="/login" register="/register" >
      <div className="max-w-3xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
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
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="description">Course Description</Label>
            <Textarea
              id="description"
              name="description"
              required
              placeholder="Enter course description"
              className="mt-1"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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
    </Layout>
  );
}
