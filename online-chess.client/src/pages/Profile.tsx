import ProfileTable from "../components/ProfileTable";
import ProfileForm from "../components/ProfileForm";


export default function Profile() {
  return (
    <div className="col">
      <div className="mt-5 mt-3 w-50">
        <h3 className="">Account Information</h3>
        <ProfileForm />
      </div>
      <h3 className="my-3">Game History</h3>
      <ProfileTable />
    </div>
  );
}
