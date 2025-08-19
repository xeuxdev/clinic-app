import { useState } from "react";
import { Link } from "react-router";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Users, Stethoscope } from "lucide-react";

export default function RoleSelection() {
  const [selectedRole, setSelectedRole] = useState<
    "attendant" | "doctor" | null
  >(null);

  const handleRoleSelect = (role: "attendant" | "doctor") => {
    setSelectedRole(role);
    // In a real app, this would set user role in context/state
    localStorage.setItem("userRole", role);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🏥 Clinic Management System
          </h1>
          <p className="text-lg text-gray-600">
            Select your role to access the system
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {/* Attendant/Receptionist Card */}
          <Card
            className={`cursor-pointer transition-all duration-200 hover:shadow-lg border-2 ${
              selectedRole === "attendant"
                ? "border-blue-500 shadow-lg ring-2 ring-blue-200"
                : "border-gray-200 hover:border-blue-300"
            }`}
            onClick={() => handleRoleSelect("attendant")}
          >
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <CardTitle className="text-xl">Attendant/Receptionist</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 mb-4">
                Front desk operations and patient management
              </p>
              <ul className="text-sm text-gray-500 space-y-2 mb-6">
                <li>• Patient registration & search</li>
                <li>• Appointment booking</li>
                <li>• Payment processing</li>
                <li>• Daily schedule management</li>
              </ul>
              {selectedRole === "attendant" && (
                <Link to="/">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    Continue as Attendant
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>

          {/* Doctor Card */}
          <Card
            className={`cursor-pointer transition-all duration-200 hover:shadow-lg border-2 ${
              selectedRole === "doctor"
                ? "border-green-500 shadow-lg ring-2 ring-green-200"
                : "border-gray-200 hover:border-green-300"
            }`}
            onClick={() => handleRoleSelect("doctor")}
          >
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Stethoscope className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className="text-xl">Doctor</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 mb-4">
                Patient consultations and medical decisions
              </p>
              <ul className="text-sm text-gray-500 space-y-2 mb-6">
                <li>• View daily appointments</li>
                <li>• Patient consultations</li>
                <li>• Medical prescriptions</li>
                <li>• Treatment recommendations</li>
              </ul>
              {selectedRole === "doctor" && (
                <Link to="/doctor">
                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    Continue as Doctor
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            Demo system for educational purposes only
          </p>
        </div>
      </div>
    </div>
  );
}
