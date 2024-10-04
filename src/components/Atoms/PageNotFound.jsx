import notfound from "../../assets/notfound.png";
import { Link } from "react-router-dom";
import { Button } from "../index";
function PageNotFound() {
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center overflow-y-auto bg-white text-white">
      <span className="w-96 h-96 rounded-xl overflow-hidden">
        {/* <img src={not_found} className=" " alt="404 not found" /> */}
        <img src={notfound} className=" " alt="404 not found" />
      </span>
      <h1 className="text-2xl">
        <Button className="rounded-sm mt-5">
          <Link to={"/"}>Return to Home</Link>
        </Button>
      </h1>
    </div>
  );
}

export default PageNotFound;
