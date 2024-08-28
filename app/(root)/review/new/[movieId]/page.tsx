function Page({ params }: { params: { movieId: string } }) {
  return (
    <div className="text-light-1">
      PAGE for review of MovieID: {params.movieId}
    </div>
  );
}

export default Page;
