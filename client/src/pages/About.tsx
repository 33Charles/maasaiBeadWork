import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/lib/use-toast";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  Users,
  HeartHandshake,
  Eye,
  Globe,
  Star,
} from "lucide-react";


const contactSchema = z.object({
  name: z.string().min(2, { message: "Name is required" }),
  email: z.string().email({ message: "Invalid email" }),
  subject: z.string().min(3, { message: "Subject is required" }),
  message: z
    .string()
    .min(20, { message: "Message must be at least 20 characters" }),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function AboutPage() {
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = (data: ContactFormData) => {
    console.log("Contact:", data);
    toast.success("Message sent! We'll respond within 24 hours.");
    reset();
  };

  return (
    <div className="min-h-screen bg-background">
      <section className="relative overflow-hidden bg-linear-to-br from-primary/10 via-background to-background py-20">
        <div className="absolute inset-0 bg-grid-primary/5 bg-size-[50px_50px]" />
        <div className="container mx-auto px-4 max-w-6xl relative z-10 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-linear-to-r from-primary to-yellow-600 bg-clip-text text-transparent">
            Maasai Beadwork Marketplace
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            A digital bridge connecting the vibrant artistry of{" "}
            <span className="text-primary font-semibold">Maasai Artisans </span>
            with conscious consumers worldwide, preserving culture, empowering
            livelihoods, and celebrating heritage.
          </p>
        </div>
      </section>

      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { label: "Artisans Empowered", value: "250+", icon: Users },
              { label: "Products Sold", value: "8,400+", icon: HeartHandshake },
              { label: "Countries Reached", value: "47", icon: Globe },
              { label: "5-Star Reviews", value: "1,200+", icon: Star },
            ].map((stat) => (
              <div key={stat.label}>
                <stat.icon className="h-10 w-10 mx-auto mb-3 text-primary" />
                <div className="text-3xl md:text-4xl font-bold text-foreground">
                  {stat.value}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <Card className="border-border shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <HeartHandshake className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-2xl">Our Mission</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  To{" "}
                  <strong className="text-foreground">
                    empower Maasai artisans
                  </strong>{" "}
                  by providing fair wages, global market access, and digital
                  tools — ensuring their cultural craft becomes a sustainable
                  source of income.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Eye className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-2xl">Our Vision</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  A world where{" "}
                  <strong className="text-foreground">
                    every bead tells a story
                  </strong>
                  , every purchase creates opportunity, and Maasai artistry is
                  celebrated on the global stage.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Star className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-2xl">Our Values</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    Fair Trade & Transparency
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    Cultural Preservation
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    Sustainability
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    Community First
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-4xl font-bold text-center mb-16">Our Journey</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                year: "2022",
                title: "The Spark",
                desc: "Founded in Nairobi by Amina Hassan after witnessing artisans struggling to sell beyond local markets.",
                highlight: true,
              },
              {
                year: "2023",
                title: "First Cohort",
                desc: "Partnered with 50 women in Narok. Built first digital catalog and trained artisans in photography and storytelling.",
              },
              {
                year: "2024",
                title: "Platform Launch",
                desc: "Official launch with 120+ products. First international sale to USA. Introduced M-Pesa & PayPal payments.",
              },
              {
                year: "2025",
                title: "Global Expansion",
                desc: "Reached 47 countries. Launched artisan training center. Achieved 100% fair wage compliance.",
                highlight: true,
              },
            ].map((milestone, i) => (
              <div
                key={i}
                className={`relative p-6 rounded-xl border ${
                  milestone.highlight
                    ? "border-primary bg-primary/5"
                    : "border-border"
                }`}
              >
                <div className="absolute -top-3 left-6 bg-background px-3">
                  <Badge
                    variant={milestone.highlight ? "default" : "secondary"}
                    className="text-lg"
                  >
                    {milestone.year}
                  </Badge>
                </div>
                <h3 className="text-xl font-bold mt-6 mb-2">
                  {milestone.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {milestone.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 max-w-7xl">
          <h2 className="text-4xl font-bold text-center mb-16">
            Leadership Team
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                name: "Amina Hassan",
                role: "Founder & CEO",
                bio: "Cultural advocate with 10+ years in fair trade. Maasai heritage.",
                avatar: "/team/amina.jpg",
              },
              {
                name: "Joseph Ole Nkurruna",
                role: "Artisan Program Director",
                bio: "Former artisan turned mentor. Ensures cultural authenticity.",
                avatar: "/team/joseph.jpg",
              },
              {
                name: "Sarah Wanjiku",
                role: "Head of Marketing",
                bio: "Digital storyteller. Grew platform from 0 to 50K followers.",
                avatar: "/team/sarah.jpg",
              },
              {
                name: "David Mburu",
                role: "Chief Technology Officer",
                bio: "Built scalable e-commerce systems for African markets.",
                avatar: "/team/david.jpg",
              },
            ].map((member) => (
              <Card
                key={member.name}
                className="border-border hover:border-primary transition-all group"
              >
                <CardContent className="p-6 text-center">
                  <Avatar className="h-28 w-28 mx-auto mb-4 ring-4 ring-background group-hover:ring-primary/20 transition-all">
                    <AvatarImage src={member.avatar} />
                    <AvatarFallback className="text-2xl bg-primary/10">
                      {member.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="text-xl font-bold">{member.name}</h3>
                  <p className="text-primary font-medium mb-2">{member.role}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {member.bio}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-4xl font-bold text-center mb-16">Get in Touch</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold mb-6">Contact Information</h3>
                <div className="space-y-5">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Mail className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold">Email Us</p>
                      <a
                        href="mailto:support@maasaibeads.com"
                        className="text-primary hover:underline"
                      >
                        hello@maasaibeads.com
                      </a>
                      <p className="text-sm text-muted-foreground">
                        Support available 24/7
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Phone className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold">Call Us</p>
                      <a
                        href="tel:+254745786500"
                        className="text-primary hover:underline"
                      >
                        +254 745 786 500
                      </a>
                      <p className="text-sm text-muted-foreground">
                        Mon–Fri, 9AM–5PM EAT
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full12 bg-primary/10 flex items-center justify-center shrink-0">
                      <MapPin className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold">Visit Us</p>
                      <p className="text-primary">Westlands, Nairobi, Kenya</p>
                      <p className="text-sm text-muted-foreground">
                        By appointment only
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-xl overflow-hidden h-64 bg-muted border border-border">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.8196541113906!2d36.801809614753!3d-1.267389835981!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f17245f0f0f0f%3A0x9c0f0f0f0f0f0f0f!2sWestlands%2C%20Nairobi!5e0!3m2!1sen!2ske!4v1698000000000!5m2!1sen!2ske"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  title="Our Location"
                />
              </div>
            </div>

            <Card className="border-border">
              <CardHeader>
                <CardTitle>Send Us a Message</CardTitle>
                <p className="text-muted-foreground">
                  We'd love to hear from you
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" {...register("name")} />
                      {errors.name && (
                        <p className="text-sm text-destructive">
                          {errors.name.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" {...register("email")} />
                      {errors.email && (
                        <p className="text-sm text-destructive">
                          {errors.email.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input id="subject" {...register("subject")} />
                    {errors.subject && (
                      <p className="text-sm text-destructive">
                        {errors.subject.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      placeholder="Tell us how we can help..."
                      className="min-h-40 resize-none"
                      {...register("message")}
                    />
                    {errors.message && (
                      <p className="text-sm text-destructive">
                        {errors.message.message}
                      </p>
                    )}
                  </div>

                  <Button type="submit" size="lg" className="w-full group">
                    <Send className="h-5 w-5 mr-2 group-hover:translate-x-1 transition-transform" />
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
