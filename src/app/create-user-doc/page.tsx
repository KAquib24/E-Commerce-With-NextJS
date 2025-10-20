// src/app/create-user-doc/page.tsx
"use client";
import { useAuth } from "@/context/AuthContext";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, User, CheckCircle, XCircle, AlertCircle } from "lucide-react";

export default function CreateUserDocPage() {
  const { user } = useAuth();
  const [status, setStatus] = useState<"checking" | "exists" | "missing" | "error" | "created">("checking");
  const [userDoc, setUserDoc] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState<any>(null);

  useEffect(() => {
    checkUserDoc();
  }, [user]);

  const checkUserDoc = async () => {
    if (!user) {
      setStatus("error");
      return;
    }

    try {
      setStatus("checking");
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        const data = userSnap.data();
        setUserDoc(data);
        setStatus("exists");
        
        // Debug info
        setDebugInfo({
          hasRole: !!data.role,
          roleValue: data.role,
          hasEmail: !!data.email,
          documentFields: Object.keys(data)
        });
      } else {
        setUserDoc(null);
        setStatus("missing");
        setDebugInfo({ error: "No document found at users/" + user.uid });
      }
    } catch (error) {
      console.error("Error checking user document:", error);
      setStatus("error");
      setDebugInfo({ 
        error: error instanceof Error ? error.message : "Unknown error occurred" 
      });
    }
  };

  const createUserDoc = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const userRef = doc(db, "users", user.uid);
      
      await setDoc(userRef, {
        email: user.email,
        name: user.displayName || user.email?.split('@')[0] || "User",
        role: "admin", // ← THIS MAKES YOU ADMIN
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        emailVerified: user.emailVerified || false,
        photoURL: user.photoURL || null
      });
      
      setStatus("created");
      setUserDoc({
        email: user.email,
        name: user.displayName || user.email?.split('@')[0] || "User",
        role: "admin",
        createdAt: new Date().toISOString()
      });
      
      // Auto-redirect to admin after 2 seconds
      setTimeout(() => {
        window.location.href = "/admin";
      }, 2000);
      
    } catch (error: any) {
      console.error("Error creating user document:", error);
      setStatus("error");
      setDebugInfo({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case "checking": return <Loader2 className="h-5 w-5 animate-spin text-blue-500" />;
      case "exists": return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "missing": return <XCircle className="h-5 w-5 text-red-500" />;
      case "created": return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "error": return <AlertCircle className="h-5 w-5 text-orange-500" />;
      default: return <User className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusMessage = () => {
    switch (status) {
      case "checking": return "Checking user document...";
      case "exists": return "User document exists!";
      case "missing": return "No user document found.";
      case "created": return "User document created successfully!";
      case "error": return "Error checking user document.";
      default: return "Unknown status";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <Card className="mb-6 border-0 shadow-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-900 flex items-center justify-center gap-2">
              <User className="h-6 w-6" />
              Admin Setup
            </CardTitle>
            <p className="text-gray-600">
              Create your user document to access the admin panel
            </p>
          </CardHeader>
        </Card>

        {/* User Info */}
        <Card className="mb-6 border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Authentication Info</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Email:</span>
                <span className="font-medium">{user?.email || "Not logged in"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">User ID:</span>
                <span className="font-mono text-sm">{user?.uid || "No UID"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <div className="flex items-center gap-2">
                  {getStatusIcon()}
                  <span>{getStatusMessage()}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Current Document Status */}
        {status === "exists" && userDoc && (
          <Card className="mb-6 border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between">
                Current User Document
                <Badge variant={userDoc.role === "admin" ? "default" : "secondary"}>
                  Role: {userDoc.role || "none"}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-auto">
                {JSON.stringify(userDoc, null, 2)}
              </pre>
              {userDoc.role !== "admin" && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-yellow-800 text-sm">
                    ⚠️ You have a user document but no admin role. Click below to update it.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Action Card */}
        <Card className="mb-6 border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Admin Setup Action</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">What this will do:</h4>
                <ul className="text-blue-800 text-sm space-y-1">
                  <li>• Create a user document in Firestore</li>
                  <li>• Set your role to "admin"</li>
                  <li>• Add your email and profile information</li>
                  <li>• Enable access to the admin panel</li>
                </ul>
              </div>

              <Button
                onClick={createUserDoc}
                disabled={loading || !user || status === "created"}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
                size="lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating User Document...
                  </>
                ) : status === "created" ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Document Created! Redirecting...
                  </>
                ) : (
                  <>
                    <User className="h-4 w-4 mr-2" />
                    Create User Document & Make Admin
                  </>
                )}
              </Button>

              <Button
                onClick={checkUserDoc}
                variant="outline"
                disabled={loading}
                className="w-full"
              >
                <Loader2 className="h-4 w-4 mr-2" />
                Re-check Document Status
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Debug Information */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Debug Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Firebase Auth:</span>
                  <Badge variant={user ? "default" : "destructive"} className="ml-2">
                    {user ? "Logged In" : "Not Logged In"}
                  </Badge>
                </div>
                <div>
                  <span className="text-gray-600">Firestore Document:</span>
                  <Badge variant={status === "exists" ? "default" : "destructive"} className="ml-2">
                    {status === "exists" ? "Exists" : "Missing"}
                  </Badge>
                </div>
              </div>
              
              {debugInfo && (
                <div className="p-3 bg-gray-100 rounded-lg">
                  <pre className="text-xs">{JSON.stringify(debugInfo, null, 2)}</pre>
                </div>
              )}

              <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <p className="text-orange-800 text-sm">
                  <strong>Note:</strong> This page creates a document at <code>users/&#123;your-user-id&#125;</code> in Firestore. 
                  Your wishlist is stored at <code>users/&#123;your-user-id&#125;/wishlist/</code> which is a subcollection and won't be affected.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        {status === "created" && (
          <Card className="mt-6 border-green-200 bg-green-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-6 w-6 text-green-600" />
                <div>
                  <h3 className="font-semibold text-green-900">Success!</h3>
                  <p className="text-green-800 text-sm">
                    You will be redirected to the admin panel automatically...
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}