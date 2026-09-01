import MagneticButton from "@/components/ui/MagneticButton";
import { WhatsAppIcon, InstagramIcon, MailIcon, CalendarIcon } from "@/components/ui/icons";
import type { Dictionary } from "@/data/content";

type ContactChannelsProps = {
  dict: Dictionary;
  className?: string;
};

/**
 * The direct contact channels (book a call, WhatsApp, Instagram, email),
 * styled as a clear icon+label list rather than muted eyebrow text — used
 * in both the contact section and the footer so neither buries them.
 */
export default function ContactChannels({ dict, className = "" }: ContactChannelsProps) {
  const { brand, contact } = dict;

  const channels = [
    {
      key: "booking",
      Icon: CalendarIcon,
      label: contact.bookingLabel,
      value: contact.bookingValue,
      href: brand.bookingUrl,
      external: true,
    },
    {
      key: "whatsapp",
      Icon: WhatsAppIcon,
      label: contact.whatsappLabel,
      value: brand.whatsappDisplay,
      href: `https://wa.me/${brand.whatsapp}`,
      external: true,
    },
    {
      key: "instagram",
      Icon: InstagramIcon,
      label: contact.instagramLabel,
      value: brand.instagramHandle,
      href: brand.instagram,
      external: true,
    },
    {
      key: "email",
      Icon: MailIcon,
      label: contact.emailLabel,
      value: brand.contactEmail,
      href: `mailto:${brand.contactEmail}`,
      external: false,
    },
  ];

  return (
    <div className={`flex flex-col ${className}`}>
      {channels.map(({ key, Icon, label, value, href, external }) => (
        <MagneticButton
          key={key}
          href={href}
          external={external}
          className="group flex items-center gap-3 py-3 border-b border-current/10 first:pt-0"
        >
          <span className="flex items-center justify-center w-9 h-9 rounded-full border border-current/25 shrink-0 group-hover:border-signal group-hover:text-signal transition-colors duration-300">
            <Icon className="w-4 h-4" />
          </span>
          <span className="flex flex-col">
            <span className="eyebrow text-current opacity-60">{label}</span>
            <span className="font-medium group-hover:text-signal transition-colors duration-300">
              {value}
            </span>
          </span>
        </MagneticButton>
      ))}
    </div>
  );
}
