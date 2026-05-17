import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

function SubmitButtonSkeleton() {
  return (
    <SkeletonTheme baseColor="#FF1780" highlightColor="#ef59bd">
      <p>
        <Skeleton
          width={200}
          height={52}
          className="rounded-full cursor-not-allowed block text-center mx-auto mb-6"
        />
      </p>
    </SkeletonTheme>
  );
}

export default SubmitButtonSkeleton;
