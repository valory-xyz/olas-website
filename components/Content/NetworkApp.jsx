import Image from "next/image";

const NetworkApp = ({ networkApp }) => {
  return (
    <a href={networkApp.url} target="_blank" rel="noopener noreferrer">
      <article class="p-6 bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700 min-h-max hover:shadow-xl">
        <div class="flex justify-between items-center">
          <div class="mx-auto mb-4">
            <Image
              src={`/images/${networkApp.name}.svg`}
              alt={networkApp.name}
              width="150"
              height="150"
            />
          </div>
        </div>
        <div className="min-h-[150px]">
          <h2 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            {networkApp.name}
          </h2>
          <div className="text-gray-600 text-xl">{networkApp.description}</div>
        </div>
      </article>
    </a>
  );
};

export default NetworkApp;
