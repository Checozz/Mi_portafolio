import {
  FaLinkedinIn,
  FaGithub,
} from "react-icons/fa6";
import { SiHuggingface } from "react-icons/si";

const SocialIcons = () => {
  return (
    <div className="my-5 flex items-center justify-center">
      <a
        href="https://www.linkedin.com/in/sergioalejandro19/"
        target="_blank"
        rel="noopener noreferrer"
        className="mr-3 text-zinc-400 hover:text-[#69c7c7] drop-shadow-[1px_1px_0_#7836cf]"
        aria-label="LinkedIn"
      >
        <FaLinkedinIn className="h-7 w-7" />
      </a>

      <a
        href="https://github.com/Checozz"
        target="_blank"
        rel="noopener noreferrer"
        className="mx-3 text-zinc-400 hover:text-[#69c7c7] drop-shadow-[1px_1px_0_#7836cf]"
        aria-label="GitHub"
      >
        <FaGithub className="h-7 w-7" />
      </a>

      <a
        href="https://huggingface.co/AstroCheco"
        target="_blank"
        rel="noopener noreferrer"
        className="mx-3 text-zinc-400 hover:text-[#69c7c7] drop-shadow-[1px_1px_0_#7836cf]"
        aria-label="Hugging Face"
      >
        <SiHuggingface className="h-7 w-7" />
      </a>
    </div>
  );
};

export default SocialIcons;
