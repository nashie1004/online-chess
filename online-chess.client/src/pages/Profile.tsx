import ProfileTable from "../components/profile/ProfileTable";
import ProfileForm from "../components/profile/ProfileForm";
import UIChanger from "../components/profile/UIChanger";

export default function Profile() {
  return (
    <div className="col">
      <div className="mt-5 mt-3 w-50">
        <ProfileForm />
      </div>
      <ProfileTable />
      <UIChanger />
    </div>
  );
}
