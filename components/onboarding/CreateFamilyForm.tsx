import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  arrayUnion,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { useAuthStore } from "@/lib/store/authStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Plus } from "lucide-react";

export function CreateFamilyForm() {
  const router = useRouter();
  const { user, setActiveFamilyId, setProfile } = useAuthStore();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !name.trim()) return;

    setLoading(true);
    setError("");

    try {
      // 1. Create Family Document
      const familyData = {
        name: name.trim(),
        ownerId: user.uid,
        createdAt: serverTimestamp(),
        inviteCode: crypto.randomUUID().substring(0, 8).toUpperCase(), // Simple short code logic could go here
        members: {
          [user.uid]: {
            role: "owner",
            joinedAt: serverTimestamp(),
            email: user.email,
            displayName: user.displayName || "Owner",
          },
        },
      };

      const familyRef = await addDoc(collection(db, "families"), familyData);
      const newFamilyId = familyRef.id;

      // 2. Update User Profile
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        familyIds: arrayUnion(newFamilyId),
      });

      // 3. Update Local State
      setActiveFamilyId(newFamilyId);
      // Optimistically update profile familyIds to avoiding waiting for auth listener
      const currentProfile = useAuthStore.getState().profile;
      if (currentProfile) {
        setProfile({
          ...currentProfile,
          familyIds: [...(currentProfile.familyIds || []), newFamilyId],
        });
      }

      // 4. Redirect
      router.push("/today");
    } catch (err) {
      console.error("Error creating family:", err);
      setError(err instanceof Error ? err.message : "Failed to create family");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleCreate} className="space-y-4">
      <div className="space-y-2">
        <Input
          placeholder="My Family Name (e.g. The Smiths)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={loading}
          required
        />
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Plus className="mr-2 h-4 w-4" />
        )}
        Create Family
      </Button>
    </form>
  );
}
