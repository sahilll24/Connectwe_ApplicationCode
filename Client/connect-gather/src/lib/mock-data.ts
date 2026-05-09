export interface Event {
  id: string;
  title: string;
  description: string;
  category: string;
  date: string;
  time: string;
  location: string;
  image: string;
  organizer: string;
  organizerAvatar: string;
  attendees: number;
  maxAttendees: number;
  status: 'pending' | 'approved' | 'rejected';
  isFeatured?: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'organizer' | 'admin';
  avatar: string;
  joinDate: string;
  status: 'active' | 'suspended';
}

export const categories = [
  { name: 'Tech', icon: '💻', count: 128 },
  { name: 'Music', icon: '🎵', count: 95 },
  { name: 'Workshops', icon: '🛠️', count: 76 },
  { name: 'Sports', icon: '⚽', count: 64 },
  { name: 'Networking', icon: '🤝', count: 112 },
  { name: 'Art', icon: '🎨', count: 48 },
];

export const mockEvents: Event[] = [
  {
    id: '1',
    title: 'React Summit 2026',
    description: 'Join us for a deep dive into the latest React patterns, performance techniques, and the future of web development. Network with fellow developers and learn from industry experts.',
    category: 'Tech',
    date: 'Mar 25, 2026',
    time: '10:00 AM',
    location: 'San Francisco, CA',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=400&fit=crop',
    organizer: 'TechCommunity SF',
    organizerAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
    attendees: 234,
    maxAttendees: 300,
    status: 'approved',
    isFeatured: true,
  },
  {
    id: '2',
    title: 'Jazz in the Park',
    description: 'An evening of smooth jazz under the stars. Bring your blanket and enjoy performances from local and touring jazz musicians.',
    category: 'Music',
    date: 'Mar 28, 2026',
    time: '6:00 PM',
    location: 'Central Park, NYC',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=400&fit=crop',
    organizer: 'NYC Music Collective',
    organizerAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face',
    attendees: 156,
    maxAttendees: 500,
    status: 'approved',
    isFeatured: true,
  },
  {
    id: '3',
    title: 'Pottery Workshop',
    description: 'Learn the basics of pottery in this hands-on workshop. All materials provided. Perfect for beginners!',
    category: 'Workshops',
    date: 'Apr 2, 2026',
    time: '2:00 PM',
    location: 'Art Studio, Brooklyn',
    image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=600&h=400&fit=crop',
    organizer: 'Brooklyn Crafts',
    organizerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
    attendees: 12,
    maxAttendees: 20,
    status: 'approved',
  },
  {
    id: '4',
    title: 'Morning Yoga & Run',
    description: 'Start your weekend with a rejuvenating yoga session followed by a 5K community run through the scenic waterfront.',
    category: 'Sports',
    date: 'Apr 5, 2026',
    time: '7:00 AM',
    location: 'Marina Bay, SF',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&h=400&fit=crop',
    organizer: 'FitLife Community',
    organizerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face',
    attendees: 45,
    maxAttendees: 100,
    status: 'approved',
  },
  {
    id: '5',
    title: 'Startup Mixer',
    description: 'Connect with founders, investors, and tech professionals at our monthly startup networking event.',
    category: 'Networking',
    date: 'Apr 8, 2026',
    time: '7:00 PM',
    location: 'WeWork, Austin TX',
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&h=400&fit=crop',
    organizer: 'Austin Startups',
    organizerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop&crop=face',
    attendees: 78,
    maxAttendees: 150,
    status: 'approved',
    isFeatured: true,
  },
  {
    id: '6',
    title: 'Watercolor Masterclass',
    description: 'Master watercolor techniques with renowned artist Maria Chen. Suitable for intermediate painters.',
    category: 'Art',
    date: 'Apr 12, 2026',
    time: '11:00 AM',
    location: 'Gallery District, LA',
    image: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=600&h=400&fit=crop',
    organizer: 'LA Art League',
    organizerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=40&h=40&fit=crop&crop=face',
    attendees: 18,
    maxAttendees: 25,
    status: 'pending',
  },
];

export const mockUsers: User[] = [
  { id: '1', name: 'Gauri Patel ', email: 'Gauri@gmail.com', role: 'user', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face', joinDate: 'Jan 15, 2026', status: 'active' },
  { id: '2', name: 'Sakshi Pendarkar', email: 'sakshi@gmail.com', role: 'organizer', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face', joinDate: 'Feb 3, 2026', status: 'active' },
  { id: '3', name: 'Praneet Bhosle', email: 'praneet@gmail.com', role: 'user', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face', joinDate: 'Feb 20, 2026', status: 'active' },
  { id: '4', name: 'Urviii Patil', email: 'Urvii@gmail.com', role: 'organizer', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop&crop=face', joinDate: 'Jan 8, 2026', status: 'active' },
  { id: '5', name: 'Neha', email: 'Neha@gmail.com', role: 'user', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face', joinDate: 'Mar 1, 2026', status: 'suspended' },
];

export const testimonials = [
  { name: 'Priya Sharma', role: 'Community Organizer', text: 'ConnectWe transformed how I manage events. The platform is intuitive and the community engagement has been incredible.', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=40&h=40&fit=crop&crop=face' },
  { name: 'Urvi Patil', role: 'Tech Meetup Host', text: 'I\'ve tried many platforms, but ConnectWe stands out with its clean design and powerful organizer tools. Highly recommended!', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face' },
  { name: 'Aditya Dakare', role: 'Fitness Instructor', text: 'My workshops are always fully booked now. The discovery features help the right people find my events effortlessly.', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop&crop=face' },
];
