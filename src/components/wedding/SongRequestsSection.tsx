import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import { useToast } from "@/hooks/use-toast";

// Replace with your Google Apps Script deployment URL for song requests
const SONG_REQUESTS_URL = 'https://script.google.com/macros/s/AKfycbwQBwMxSt7ZFJgXkqMdezNbxDDQRJ7m_uW-4CWL9zfvfyNMVzI5kgB30fTxIfwUKLYX/exec';

interface SongRequestsSectionProps {
  guestName: string;
}

const SongRequestsSection = ({ guestName }: SongRequestsSectionProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    songTitle: "",
    artist: "",
    specialReason: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const timestamp = new Date().toISOString();
      const params = new URLSearchParams();
      params.append('guestName', guestName);
      params.append('songTitle', formData.songTitle);
      params.append('artist', formData.artist);
      params.append('specialReason', formData.specialReason || '');
      params.append('timestamp', timestamp);

      await fetch(SONG_REQUESTS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString(),
        mode: 'no-cors'
      });

      toast({
        title: "Song Added!",
        description: "Thanks for the request. We can't wait to dance to it!",
      });
      setFormData({
        songTitle: "",
        artist: "",
        specialReason: "",
      });
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <section ref={ref} className="section-padding gradient-sage">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <p className="decorative-flourish mb-4">♫</p>
          <h2 className="font-serif text-4xl md:text-5xl font-light text-foreground mb-4">
            Song Requests
          </h2>
          <div className="decorative-line mb-6" />
          <p className="text-muted-foreground font-light">
            Help us create the perfect playlist for our celebration!
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          onSubmit={handleSubmit}
          className="space-y-6 bg-white/50 backdrop-blur-sm p-8 rounded-lg shadow-lg"
        >

          <div>
            <label
              htmlFor="songTitle"
              className="block text-sm uppercase tracking-widest text-primary mb-2 font-sans font-semibold"
            >
              Song Title
            </label>
            <input
              type="text"
              id="songTitle"
              name="songTitle"
              required
              value={formData.songTitle}
              onChange={handleChange}
              placeholder="Enter the song name"
              className="w-full px-4 py-3 bg-white border border-gray-300 focus:border-primary focus:outline-none transition-colors font-sans text-foreground"
            />
          </div>

          <div>
            <label
              htmlFor="artist"
              className="block text-sm uppercase tracking-widest text-primary mb-2 font-sans font-semibold"
            >
              Artist
            </label>
            <input
              type="text"
              id="artist"
              name="artist"
              required
              value={formData.artist}
              onChange={handleChange}
              placeholder="Who performs this song?"
              className="w-full px-4 py-3 bg-white border border-gray-300 focus:border-primary focus:outline-none transition-colors font-sans text-foreground"
            />
          </div>

          <div>
            <label
              htmlFor="specialReason"
              className="block text-sm uppercase tracking-widest text-primary mb-2 font-sans font-semibold"
            >
              Why This Song? (Optional)
            </label>
            <textarea
              id="specialReason"
              name="specialReason"
              rows={3}
              value={formData.specialReason}
              onChange={handleChange}
              placeholder="Tell us why this song is special..."
              className="w-full px-4 py-3 bg-white border border-gray-300 focus:border-primary focus:outline-none transition-colors font-sans text-foreground resize-none"
            />
          </div>

          <div className="text-center pt-4">
            <button
              type="submit"
              disabled={isSubmitting || !guestName}
              className="w-full py-4 bg-primary text-primary-foreground font-sans text-base tracking-widest uppercase hover:bg-primary/90 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Adding Song...' : !guestName ? 'Enter Your Name Above First' : 'Add Song Request'}
            </button>
          </div>
        </motion.form>
      </div>
    </section>
  );
};

export default SongRequestsSection;
