import React from "react";
import {
  Search,
  Plus,
  Heart,
  Bone,
  User,
  ChevronRight,
  Stethoscope,
  Activity,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import type { Route } from "./+types/services";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Medical Services - Healthcare Portal" },
    {
      name: "description",
      content:
        "Comprehensive care across multiple specialties to keep you healthy.",
    },
  ];
}

export default function ServicesPage() {
  // Popular services data
  const popularServices = [
    {
      icon: Plus,
      title: "General Health Check-Up",
      description:
        "Your first step to staying healthy, routine exams for all ages",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      icon: Heart,
      title: "Cardiology Consultation",
      description: "Specialized care for your heart health",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      icon: User,
      title: "Pediatric Check-Up",
      description:
        "Gentle, comprehensive care for your child's health and growth",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      icon: Activity,
      title: "Dental Cleaning & Check-Up",
      description: "Prevent cavities and keep your smile bright",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
  ];

  // Categories of services data
  const serviceCategories = [
    {
      icon: Plus,
      title: "Primary Care",
      description: "Your first stop for everyday health needs",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      icon: Heart,
      title: "Heart & Vascular Care",
      description: "Specialized treatment for your heart and blood vessels",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      icon: Bone,
      title: "Bone, Joint & Muscle Care",
      description: "Expert care for movement, strength, and injury recovery",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      icon: Activity,
      title: "Dental & Oral Health",
      description: "Healthy smiles, from routine checks to advanced treatment",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
  ];

  // List of services data
  const servicesList = [
    "General Health Checkup",
    "Cardiology Consultation",
    "Pediatric Check-Up",
    "Orthopedic Consultation",
    "Dental Cleaning & Check-Up",
    "Dermatology Consultation",
  ];

  return (
    <div className="flex flex-1 p-3 sm:p-6">
      <div className="flex-1 max-w-6xl mx-auto">
        {/* Header Section */}
        <Card className="mb-6">
          <CardContent className="p-2 sm:p-4">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
              <div className="flex-1 p-2 sm:p-4 text-center lg:text-left">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                  Our Medical Services
                </h2>
                <p className="text-sm sm:text-base text-gray-600 mb-4">
                  Comprehensive care across multiple specialties to keep you
                  healthy.
                </p>
              </div>
              <div className="w-full lg:w-64 h-48 lg:h-full">
                <img
                  src="/hero-home.svg"
                  alt="Medical services illustration"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Popular Services Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Stethoscope className="h-4 w-4 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Popular Services
                </h2>
                <p className="text-sm text-gray-600">
                  Most requested by our patients
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              className="text-primary hover:bg-primary/10"
            >
              View All <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {popularServices.map((service, index) => {
              const IconComponent = service.icon;
              return (
                <Card
                  key={index}
                  className="group hover:shadow-xl transition-all duration-500 cursor-pointer border-0 bg-gradient-to-br from-white via-gray-50/50 to-white hover:from-primary/5 hover:to-primary/10"
                >
                  <CardContent className="p-6 h-full flex flex-col justify-between">
                    <div>
                      <div
                        className={`w-12 h-12 ${service.iconBg} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                      >
                        <IconComponent
                          className={`h-6 w-6 ${service.iconColor}`}
                        />
                      </div>
                      <h3 className="font-semibold text-lg text-gray-900 mb-2 group-hover:text-primary transition-colors">
                        {service.title}
                      </h3>
                      <p className="text-sm text-gray-600 leading-relaxed mb-6">
                        {service.description}
                      </p>
                    </div>
                    <div className="mt-auto">
                      <Button size="sm" className="w-full">
                        Book Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Categories of Services Section */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Categories of Services
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore our comprehensive range of medical specialties designed to
              meet all your healthcare needs
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {serviceCategories.map((category, index) => {
              const IconComponent = category.icon;
              const colors = [
                {
                  bg: "bg-blue-50",
                  border: "border-blue-200",
                  icon: "text-blue-600",
                  hover: "hover:bg-blue-100",
                },
                {
                  bg: "bg-green-50",
                  border: "border-green-200",
                  icon: "text-green-600",
                  hover: "hover:bg-green-100",
                },
                {
                  bg: "bg-purple-50",
                  border: "border-purple-200",
                  icon: "text-purple-600",
                  hover: "hover:bg-purple-100",
                },
                {
                  bg: "bg-orange-50",
                  border: "border-orange-200",
                  icon: "text-orange-600",
                  hover: "hover:bg-orange-100",
                },
              ];
              const color = colors[index % colors.length];

              return (
                <Card
                  key={index}
                  className={`group ${color.bg} ${color.border} border-2 ${color.hover} hover:shadow-lg transition-all duration-300 cursor-pointer`}
                >
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm group-hover:shadow-md transition-shadow">
                      <IconComponent
                        className={`h-8 w-8 ${color.icon} group-hover:scale-110 transition-transform duration-300`}
                      />
                    </div>
                    <h3 className="font-bold text-base text-gray-900 mb-2">
                      {category.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                      {category.description}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full group-hover:bg-white"
                    >
                      Explore Services
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="text-center">
            <Button variant="outline" className="px-8 py-2">
              View All Categories
            </Button>
          </div>
        </div>

        {/* List of Services Section */}
        <Card className="shadow-sm">
          <CardHeader className="bg-gray-50 border-b">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold text-gray-900">
                  Complete Service Directory
                </CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  Browse our full range of medical services
                </p>
              </div>
              <Button variant="outline">View All Services</Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-100">
              {servicesList.map((service, index) => (
                <div
                  key={index}
                  className="group flex items-center justify-between p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <Plus className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <span className="font-medium text-gray-900 group-hover:text-primary transition-colors">
                        {service}
                      </span>
                      <p className="text-sm text-gray-500">
                        Available for booking
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button size="sm" variant="outline">
                      Learn More
                    </Button>
                    <Button size="sm">Book Now</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
