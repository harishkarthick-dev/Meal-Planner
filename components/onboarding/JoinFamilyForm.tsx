import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  arrayUnion,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { useAuthStore } from "@/lib/store/authStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Users } from "lucide-react";

export function JoinFamilyForm() {
  const router = useRouter();
  const { user, setActiveFamilyId, setProfile } = useAuthStore();
  const [inviteCode, setInviteCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !inviteCode.trim()) return;

    setLoading(true);
    setError("");

    try {
      const familiesRef = collection(db, "families");
      const q = query(
        familiesRef,
        where("inviteCode", "==", inviteCode.trim().toUpperCase()),
      );
      const snapshot = await getDocs(q);

      let familyId = "";
      let familyData = null;

      if (!snapshot.empty) {
        const docSnap = snapshot.docs[0];
        familyId = docSnap.id;
        familyData = docSnap.data();
      } else {
        throw new Error("Invalid invite code. Please check and try again.");
      }

      if (familyData?.members && familyData.members[user.uid]) {
        setActiveFamilyId(familyId);
        router.push("/today");
        return;
      }

      const familyRef = doc(db, "families", familyId);
      await updateDoc(familyRef, {
        [`members.${user.uid}`]: {
          role: "member",
          joinedAt: serverTimestamp(),
          email: user.email,
          displayName: user.displayName || "Member",
        },
      });

      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        familyIds: arrayUnion(familyId),
      });

      setActiveFamilyId(familyId);
      const currentProfile = useAuthStore.getState().profile;
      if (currentProfile) {
        setProfile({
          ...currentProfile,
          familyIds: [...(currentProfile.familyIds || []), familyId],
        });
      }

      router.push("/today");
    } catch (err) {
      console.error("Error joining family:", err);
      setError(err instanceof Error ? err.message : "Failed to join family");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleJoin} className="space-y-4">
      <div className="space-y-2">
        <Input
          placeholder="Enter Invite Code"
          value={inviteCode}
          onChange={(e) => setInviteCode(e.target.value)}
          disabled={loading}
          required
        />
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button
        type="submit"
        variant="secondary"
        className="w-full"
        disabled={loading}
      >
        {loading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Users className="mr-2 h-4 w-4" />
        )}
        Join Family
      </Button>
    </form>
  );
}
