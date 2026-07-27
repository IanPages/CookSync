import { UserGroupIcon, BookOpenIcon, ShoppingCartIcon, ChatBubbleLeftRightIcon, SparklesIcon, CakeIcon, CalendarDaysIcon, CurrencyDollarIcon, BellAlertIcon } from '@heroicons/react/24/outline';

export default function About() {
    return (
        <div className="max-w-5xl mx-auto mt-10 pb-20 space-y-16">

            {/* Hero Section */}
            <div className="text-center space-y-6">
                <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                    Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-cook-primary to-cook-accent">CookSync</span>
                </h1>
                <p className="text-lg md:text-xl  max-w-3xl mx-auto leading-relaxed">
                    The ultimate collaborative platform designed to bring households together.
                    Whether you are roommates, a family, or a couple, CookSync streamlines how you manage your kitchen, meals, and groceries.
                </p>
            </div>

            {/* Purpose Section */}
            <div className="bg-cook-surface border border-white/10 rounded-3xl p-8 md:p-12 backdrop-blur-md shadow-xl shadow-cook-accent/10">
                <h2 className="text-3xl font-semibold text-cook-accent mb-6">Our Purpose</h2>
                <p className="text-cook-main text-lg leading-relaxed">
                    Cooking and grocery shopping for a household often leads to scattered lists, duplicated purchases, and the endless daily question: <span className="text-cook-accent font-semibold italic"> "What are we having for dinner?"</span>.
                    CookSync was built to eliminate this friction. We provide a single, synchronized hub where everyone in your home stays on the same page. From deciding on a recipe to buying the ingredients, CookSync makes household food management collaborative, efficient, and fun.
                </p>
            </div>

            {/* What We Offer Section */}
            <div className="space-y-8">
                <h2 className="text-3xl font-semibold text-cook-accent text-center">What We Offer</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Card 1 */}
                    <div className="bg-cook-surface border border-white/10 p-6 rounded-2xl  transition-colors duration-300">
                        <div className="bg-cook-primary/20 w-12 h-12 flex items-center justify-center rounded-xl mb-4">
                            <UserGroupIcon className="text-cook-primary h-7 w-7" />
                        </div>
                        <h3 className="text-xl font-bold text-cook-primary mb-2">Shared Households</h3>
                        <p className="text-cook-main">
                            Create a secure digital home and invite your members. Everyone syncs in real-time to a shared dashboard.
                        </p>
                    </div>

                    {/* Card 2 */}
                    <div className="bg-cook-surface border border-white/10 p-6 rounded-2xl  transition-colors duration-300">
                        <div className="bg-cook-accent/20 w-12 h-12 flex items-center justify-center rounded-xl mb-4">
                            <ShoppingCartIcon className="text-cook-accent h-7 w-7" />
                        </div>
                        <h3 className="text-xl font-bold text-cook-accent mb-2">Smart Shopping Lists</h3>
                        <p className="text-cook-main">
                            A synchronized shopping list. Anyone can add items, and when someone marks them as bought, the whole house knows instantly.
                        </p>
                    </div>

                    {/* Card 3 */}
                    <div className="bg-cook-surface border border-white/10 p-6 rounded-2xl  transition-colors duration-300">
                        <div className="bg-cook-primary/20 w-12 h-12 flex items-center justify-center rounded-xl mb-4">
                            <BookOpenIcon className="text-cook-primary h-7 w-7" />
                        </div>
                        <h3 className="text-xl font-bold text-cook-primary mb-2">Collaborative Recipe Book</h3>
                        <p className="text-cook-main">
                            Store and organize your household's favorite recipes. Easily track cooking history to remember what you ate last week.
                        </p>
                    </div>

                    {/* Card 4 */}
                    <div className="bg-cook-surface border border-white/10 p-6 rounded-2xl transition-colors duration-300">
                        <div className="bg-cook-accent/20 w-12 h-12 flex items-center justify-center rounded-xl mb-4">
                            <ChatBubbleLeftRightIcon className="text-cook-accent h-7 w-7" />
                        </div>
                        <h3 className="text-xl font-bold text-cook-accent mb-2">Integrated Chat</h3>
                        <p className="text-cook-main">
                            Discuss meal ideas or coordinate grocery runs right inside the app with the built-in household messaging system.
                        </p>
                    </div>

                </div>
            </div>

            {/* Roadmap / Future Features */}
            <div className="relative overflow-hidden bg-gradient-to-br from-cook-primary/10 to-cook-accent/10 border border-white/10 rounded-3xl p-8 md:p-12">
                <div className="absolute top-0 right-0 -mt-8 -mr-8 opacity-30">
                    <CakeIcon className="w-64 h-64 text-cook-accent" />
                </div>

                <div className="relative z-10">
                    <h2 className="text-3xl font-semibold text-cook-accent mb-6">What We Will Implement</h2>
                    <p className="text-cook-main text-lg mb-8 max-w-2xl">
                        We are constantly working to improve CookSync. Here is a sneak peek at our product roadmap and features coming in future updates:
                    </p>

                    <ul className="space-y-4">
                        <li className="flex items-center gap-4">
                            <div className="bg-white/10 p-2 rounded-lg">
                                <SparklesIcon className="h-6 w-6 text-cook-primary" />
                            </div>
                            <span className="text-cook-main text-lg">AI-Powered Recipe Generation based on your available ingredients</span>
                        </li>
                        <li className="flex items-center gap-4">
                            <div className="bg-white/10 p-2 rounded-lg">
                                <CurrencyDollarIcon className="h-6 w-6 text-cook-accent" />
                            </div>
                            <span className="text-cook-main text-lg">Automated expense splitting and receipt scanning for groceries</span>
                        </li>
                        <li className="flex items-center gap-4">
                            <div className="bg-white/10 p-2 rounded-lg">
                                <CalendarDaysIcon className="h-6 w-6 text-cook-primary" />
                            </div>
                            <span className="text-cook-main text-lg">Advanced Weekly Meal Planning Calendars</span>
                        </li>
                        <li className="flex items-center gap-4">
                            <div className="bg-white/10 p-2 rounded-lg">
                                <BellAlertIcon className="h-6 w-6 text-cook-accent" />
                            </div>
                            <span className="text-cook-main text-lg">Push notifications for urgent shopping needs and chat messages</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )
}