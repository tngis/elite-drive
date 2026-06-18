import type { Metadata } from "next";
import { ContentPage } from "@/features/marketing/content-page";

export const metadata: Metadata = {
  title: "Карьер — Elite Drive",
  description: "Elite Drive-тай хамт Монголын тээврийн ирээдүйг бүтээ.",
};

export default function CareersPage() {
  return (
    <ContentPage
      title="Карьер"
      subtitle="Монголын машин түрээсийн зах зээлийг бид хамтдаа бүтээж байна."
    >
      <p>
        Elite Drive бол хурдтай хөгжиж буй баг. Бид технологи, дизайн, үйл
        ажиллагаа, маркетингийн чиглэлээр шинэ санаа, эрч хүчтэй хүмүүсийг угтан
        авдаг.
      </p>

      <h2>Нээлттэй ажлын байр</h2>
      <p>
        Одоогоор нийтэлсэн нээлттэй ажлын байр алга байна. Гэхдээ та өөрийгөө
        бидэнд тохирно гэж бодвол анкетаа илгээгээрэй — бид үргэлж авьяаслаг
        хүмүүсийг хайж байдаг.
      </p>

      <h2>Хэрхэн өргөдөл гаргах вэ</h2>
      <p>
        CV болон танилцуулгаа{" "}
        <strong>careers@elitedrive.mn</strong> хаягаар илгээнэ үү. Бид тохирох
        бол тантай эргэн холбогдоно.
      </p>
    </ContentPage>
  );
}
