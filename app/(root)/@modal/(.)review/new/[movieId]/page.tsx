import { Modal } from "./modal";

export default function Page({ params }: { params: { movieId: string } }) {
  return <Modal>MODAL for review of Movie: {params.movieId}</Modal>;
}
