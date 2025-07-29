import Button from "../components/Button";

export default function NotFoundPage() {
    return (
        <div className="flex flex-col items-center gap-4 justify-center h-screen text-center">
            <h1 className="text-6xl font-bold text-white">404</h1>
            <p className=" text-lg text-white">Page Not Found</p>
            <div className="w-1/4">
                <Button text='Go To Home' url='/' />

            </div>
        </div>
    );
}
