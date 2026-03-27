import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact AnnoyingKids — We Actually Respond',
  description:
    'Get in touch with AnnoyingKids — order questions, returns, wholesale inquiries, or just to say hi.',
  alternates: { canonical: 'https://www.annoyingkids.com/contact' },
};

export default function ContactPage() {
  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-16">
          <span className="font-space text-neon-green text-sm uppercase tracking-widest">
            Talk to Us
          </span>
          <h1 className="font-bungee text-4xl sm:text-5xl text-white mt-4">
            Get in <span className="text-neon-pink">Touch</span>
          </h1>
          <p className="font-space text-gray-500 mt-4">
            Real humans. Real responses. Usually within 1 business day.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
          {[
            { icon: '📦', title: 'Order Support', desc: 'Questions about your order, tracking, or returns', href: 'mailto:support@annoyingkids.com' },
            { icon: '💬', title: 'General Inquiries', desc: 'Everything else — feedback, collabs, ideas', href: 'mailto:hello@annoyingkids.com' },
          ].map((card) => (
            <a
              key={card.title}
              href={card.href}
              className="bg-dark-card border border-dark-border rounded-xl p-6 hover:border-neon-pink/40 transition-all duration-300 group"
            >
              <span className="text-3xl mb-3 inline-block">{card.icon}</span>
              <h2 className="font-bungee text-white text-base mb-1 group-hover:text-neon-pink transition-colors">
                {card.title}
              </h2>
              <p className="font-space text-gray-500 text-sm">{card.desc}</p>
            </a>
          ))}
        </div>

        <div className="bg-dark-card border border-dark-border rounded-2xl p-8">
          <h2 className="font-bungee text-white text-xl mb-6">Send a Message</h2>
          <form
            action="https://formsubmit.co/hello@annoyingkids.com"
            method="POST"
            className="space-y-5"
          >
            <input type="hidden" name="_subject" value="AnnoyingKids Contact Form" />
            <input type="hidden" name="_next" value="https://www.annoyingkids.com/contact?sent=true" />
            <input type="text" name="_honey" className="hidden" />

            <div>
              <label className="font-bungee text-gray-400 text-xs uppercase tracking-wider block mb-2">
                Name
              </label>
              <input
                type="text"
                name="name"
                required
                placeholder="Your name"
                className="w-full bg-dark-surface border border-dark-border rounded-lg px-4 py-3
                  font-space text-sm text-white placeholder-gray-600
                  focus:outline-none focus:border-neon-pink/50 transition-all duration-300"
              />
            </div>

            <div>
              <label className="font-bungee text-gray-400 text-xs uppercase tracking-wider block mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                required
                placeholder="your@email.com"
                className="w-full bg-dark-surface border border-dark-border rounded-lg px-4 py-3
                  font-space text-sm text-white placeholder-gray-600
                  focus:outline-none focus:border-neon-pink/50 transition-all duration-300"
              />
            </div>

            <div>
              <label className="font-bungee text-gray-400 text-xs uppercase tracking-wider block mb-2">
                Order Number (optional)
              </label>
              <input
                type="text"
                name="order_number"
                placeholder="e.g. AK-12345"
                className="w-full bg-dark-surface border border-dark-border rounded-lg px-4 py-3
                  font-space text-sm text-white placeholder-gray-600
                  focus:outline-none focus:border-neon-pink/50 transition-all duration-300"
              />
            </div>

            <div>
              <label className="font-bungee text-gray-400 text-xs uppercase tracking-wider block mb-2">
                Message
              </label>
              <textarea
                name="message"
                required
                rows={5}
                placeholder="Tell us what's up..."
                className="w-full bg-dark-surface border border-dark-border rounded-lg px-4 py-3
                  font-space text-sm text-white placeholder-gray-600
                  focus:outline-none focus:border-neon-pink/50 transition-all duration-300 resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full px-8 py-4 bg-neon-pink text-white font-bungee text-lg uppercase rounded-lg
                shadow-[0_0_20px_rgba(255,45,120,0.4)] hover:shadow-[0_0_30px_rgba(255,45,120,0.7)]
                transition-all duration-300 hover:scale-[1.01] active:scale-[0.99]"
            >
              Send It 🚀
            </button>
          </form>
        </div>

        <p className="font-space text-gray-600 text-xs text-center mt-8">
          We typically respond within 1 business day. For urgent order issues,
          email support@annoyingkids.com directly.
        </p>
      </div>
    </div>
  );
}
