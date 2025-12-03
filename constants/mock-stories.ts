export interface StoryUser {
  id: string;
  username: string;
  avatar: string;
  hasStory: boolean;
}

export const MOCK_STORIES: StoryUser[] = [
  {
    id: '1',
    username: 'Your Story',
    avatar: 'https://i.pravatar.cc/150?img=1',
    hasStory: false, // Your story - always show
  },
  {
    id: '2',
    username: 'alex_photo',
    avatar: 'https://i.pravatar.cc/150?img=12',
    hasStory: true,
  },
  {
    id: '3',
    username: 'maria_design',
    avatar: 'https://i.pravatar.cc/150?img=5',
    hasStory: true,
  },
  {
    id: '4',
    username: 'john_dev',
    avatar: 'https://i.pravatar.cc/150?img=33',
    hasStory: true,
  },
  {
    id: '5',
    username: 'sarah_art',
    avatar: 'https://i.pravatar.cc/150?img=47',
    hasStory: true,
  },
  {
    id: '6',
    username: 'mike_travel',
    avatar: 'https://i.pravatar.cc/150?img=15',
    hasStory: true,
  },
  {
    id: '7',
    username: 'emma_food',
    avatar: 'https://i.pravatar.cc/150?img=20',
    hasStory: true,
  },
  {
    id: '8',
    username: 'david_fit',
    avatar: 'https://i.pravatar.cc/150?img=52',
    hasStory: true,
  },
  {
    id: '9',
    username: 'lisa_music',
    avatar: 'https://i.pravatar.cc/150?img=45',
    hasStory: true,
  },
  {
    id: '10',
    username: 'tom_tech',
    avatar: 'https://i.pravatar.cc/150?img=60',
    hasStory: true,
  },
  {
    id: '11',
    username: 'kate_yoga',
    avatar: 'https://i.pravatar.cc/150?img=25',
    hasStory: true,
  },
  {
    id: '12',
    username: 'chris_gaming',
    avatar: 'https://i.pravatar.cc/150?img=68',
    hasStory: true,
  },
  {
    id: '13',
    username: 'anna_books',
    avatar: 'https://i.pravatar.cc/150?img=32',
    hasStory: true,
  },
  {
    id: '14',
    username: 'ryan_sports',
    avatar: 'https://i.pravatar.cc/150?img=51',
    hasStory: true,
  },
  {
    id: '15',
    username: 'julia_fashion',
    avatar: 'https://i.pravatar.cc/150?img=44',
    hasStory: true,
  },
  {
    id: '16',
    username: 'mark_coffee',
    avatar: 'https://i.pravatar.cc/150?img=13',
    hasStory: true,
  },
  {
    id: '17',
    username: 'olivia_pets',
    avatar: 'https://i.pravatar.cc/150?img=29',
    hasStory: true,
  },
  {
    id: '18',
    username: 'james_cars',
    avatar: 'https://i.pravatar.cc/150?img=58',
    hasStory: true,
  },
  {
    id: '19',
    username: 'sophia_nature',
    avatar: 'https://i.pravatar.cc/150?img=41',
    hasStory: true,
  },
  {
    id: '20',
    username: 'daniel_film',
    avatar: 'https://i.pravatar.cc/150?img=70',
    hasStory: true,
  },
];
