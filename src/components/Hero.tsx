export default function Hero() {
  return (
    <section className="hero-gradient relative flex min-h-[85vh] items-center overflow-hidden pt-20">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -right-20 top-1/4 h-96 w-96 rounded-full bg-nike-volt blur-3xl" />
        <div className="absolute -left-20 bottom-1/4 h-64 w-64 rounded-full bg-nike-orange blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6 py-20">
        <p className="animate-fade-up mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-nike-volt">
          Share · Remember · Connect
        </p>
        <h1 className="animate-fade-up-delay-1 text-display text-[clamp(4rem,12vw,9rem)] leading-[0.9] text-white">
          OUR
          <br />
          <span className="text-nike-volt">MOMENTS</span>
        </h1>
        <p className="animate-fade-up-delay-2 mt-8 max-w-md text-lg text-neutral-300">
          친구들과 함께한 순간을 사진으로 남기고,
          <br />
          방명록에 마음을 전하세요.
        </p>
        <div className="animate-fade-up-delay-2 mt-10 flex flex-wrap gap-4">
          <a href="#photos" className="nike-btn nike-btn-primary animate-pulse-volt">
            사진 올리기
          </a>
          <a href="#guestbook" className="nike-btn border-2 border-white text-white hover:bg-white hover:text-nike-black">
            방명록 쓰기
          </a>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-16 bg-nike-white swoosh-accent" />
    </section>
  );
}
