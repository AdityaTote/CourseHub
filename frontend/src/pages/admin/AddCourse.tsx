import React from "react";
import { Layout } from "../../components/Layout";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";

export function AddCourse() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle course addition logic here
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8">
          Add New Course
        </h1>
        <form
          onSubmit={handleSubmit}
          className="space-y-6 bg-white shadow rounded-lg p-8"
        >
          <div>
            <Label htmlFor="title">Course Title</Label>
            <Input id="title" name="title" required className="mt-1" />
          </div>
          <div>
            <Label htmlFor="description">Course Description</Label>
            <Textarea
              id="description"
              name="description"
              required
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="price">Price (ETH)</Label>
            <Input
              id="price"
              name="price"
              type="number"
              step="0.01"
              required
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="duration">Duration</Label>
            <Input id="duration" name="duration" required className="mt-1" />
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
