import { Link } from "react-router-dom";
import { Layout } from "../components/Layout";
import { Button } from "../components/ui/button";

export function Home() {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-4xl md:text-5xl">
            <span className="block">Marketplace for Knowledge</span>
            <span className="block text-blue-600">
              Buy, Sell, Teach, Learn{" "}
            </span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-lg md:text-center  md:max-w-3xl">
            A dynamic marketplace where educators can share their expertise and
            learners can access valuable courses empowering growth, knowledge,
            and opportunity
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <Link to="/courses">
              <Button className="w-full sm:w-auto bg-blue-600 text-white hover:bg-blue-700">
                Explore Courses
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
