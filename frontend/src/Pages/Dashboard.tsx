import MasonryGrid1 from "../Components/MasonryGrid1";

const sampleImages = [
  "https://i.pinimg.com/736x/d5/fc/59/d5fc59a43c5029762858f3d382456d72.jpg",
  "https://i.pinimg.com/736x/d5/fc/59/d5fc59a43c5029762858f3d382456d72.jpg",
  "https://i.pinimg.com/736x/d5/fc/59/d5fc59a43c5029762858f3d382456d72.jpg",
  "https://i.pinimg.com/736x/d5/fc/59/d5fc59a43c5029762858f3d382456d72.jpg",
  "https://i.pinimg.com/736x/d5/fc/59/d5fc59a43c5029762858f3d382456d72.jpg",
  "https://i.pinimg.com/736x/d5/fc/59/d5fc59a43c5029762858f3d382456d72.jpg",
  "https://i.pinimg.com/736x/d5/fc/59/d5fc59a43c5029762858f3d382456d72.jpg",
  "https://i.pinimg.com/736x/d5/fc/59/d5fc59a43c5029762858f3d382456d72.jpg",
  "https://i.pinimg.com/736x/6d/a1/d9/6da1d9ff2b19e8651252a3b417826f54.jpg",
  "https://i.pinimg.com/1200x/f1/b9/04/f1b9041b0167983ca4a9ec1f4d1527c8.jpg",
  "https://i.pinimg.com/736x/3b/2b/5b/3b2b5bf2914fc22ae86a309c31fb070c.jpg",
];

const Dashboard = () => {
  return (
    <div>
      <MasonryGrid1 images={sampleImages} />
    </div>
  );
};

export default Dashboard;
