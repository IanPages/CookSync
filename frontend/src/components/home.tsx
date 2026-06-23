import { useState } from 'react'
import {
    HomeIcon,
    ShoppingCartIcon,
    SparklesIcon,
    ArrowRightIcon,
    CheckIcon,
    PlusIcon
} from '@heroicons/react/24/outline'

export default function Home() {
    const [groceryList, setGroceryList] = useState([
        { id: 1, name: 'Boneless chicken breasts', checked: false },
        { id: 2, name: 'Heavy whipping cream', checked: true },
        { id: 3, name: 'Fresh baby spinach', checked: false },
        { id: 4, name: 'Penne pasta (500g)', checked: false },
        { id: 5, name: 'Garlic cloves & parmesan', checked: false },
    ])

    const toggleGroceryItem = (id: number) => {
        setGroceryList(prev => prev.map(item => item.id === id ? { ...item, checked: !item.checked } : item))
    }

    const [newItemName, setNewItemName] = useState('')
    const handleAddItem = (e: React.FormEvent) => {
        e.preventDefault()
        if (!newItemName.trim()) return
        setGroceryList(prev => [
            ...prev,
            { id: Date.now(), name: newItemName.trim(), checked: false }
        ])
        setNewItemName('')
    }

    return (
        <div className="space-y-16 py-8 animate-fade-in">
            <section className="text-center max-w-4xl mx-auto space-y-6 px-4">
                <h1 className="text-4xl md:text-6xl font-extrabold text-cook-main tracking-tight leading-tight">
                    Sync your kitchen, <br />
                    <span className="text-cook-accent bg-gradient-to-r from-cook-accent to-cook-primary bg-clip-text text-transparent">
                        share the joy of cooking.
                    </span>
                </h1>

                <p className="text-lg md:text-xl text-cook-muted max-w-2xl mx-auto font-medium leading-relaxed">
                    The ultimate shared culinary workspace for you and your partner. Organize your household, coordinate grocery shopping, and chat with an AI sous-chef that understands your kitchen.
                </p>

                <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
                    <button className="flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold shadow-lg shadow-cook-primary/20 hover:scale-[1.02] hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer">
                        Get Started Free
                        <ArrowRightIcon className="size-5" />
                    </button>
                    <a href="#demo" className="px-8 py-3.5 rounded-xl font-semibold border-2 border-cook-primary/30 text-cook-main hover:bg-cook-primary/5 hover:border-cook-primary hover:-translate-y-0.5 active:translate-y-0 transition-all text-center w-full sm:w-auto">
                        See it in Action
                    </a>
                </div>
            </section>

            {/* Features Grid */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto px-4">
                {/* Card 1 */}
                <div className="bg-cook-surface rounded-2xl p-6 shadow-xs border border-cook-primary/10 hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group">
                    <div>
                        <div className="size-12 rounded-xl bg-cook-accent/10 text-cook-accent flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                            <HomeIcon className="size-6" />
                        </div>
                        <h3 className="text-xl font-bold text-cook-main mb-2">Shared Household</h3>
                        <p className="text-cook-muted text-sm leading-relaxed">
                            Connect accounts with your partner to manage a unified kitchen. Sync pantries, share schedules, and collaborate in real-time.
                        </p>
                    </div>
                    <div className="mt-6 pt-2 text-xs font-semibold text-cook-accent flex items-center gap-1">
                        Setup shared house &rarr;
                    </div>
                </div>

                {/* Card 2 */}
                <div className="bg-cook-surface rounded-2xl p-6 shadow-xs border border-cook-primary/10 hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group">
                    <div>
                        <div className="size-12 rounded-xl bg-cook-primary/10 text-cook-primary flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                            <ShoppingCartIcon className="size-6" />
                        </div>
                        <h3 className="text-xl font-bold text-cook-main mb-2">Built-in Grocery List</h3>
                        <p className="text-cook-muted text-sm leading-relaxed">
                            Say goodbye to double-buying. Tick items off on-the-go, group ingredients by department, and see changes instantly.
                        </p>
                    </div>
                    <div className="mt-6 pt-2 text-xs font-semibold text-cook-primary flex items-center gap-1">
                        Open grocery list &rarr;
                    </div>
                </div>

                {/* Card 3 */}
                <div className="bg-cook-surface rounded-2xl p-6 shadow-xs border border-cook-primary/10 hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group">
                    <div>
                        <div className="size-12 rounded-xl bg-cook-accent/10 text-cook-accent flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                            <SparklesIcon className="size-6" />
                        </div>
                        <h3 className="text-xl font-bold text-cook-main mb-2">AI Sous-Chef</h3>
                        <p className="text-cook-muted text-sm leading-relaxed">
                            Chat with an AI model that searches recipes, auto-extracts ingredients, and adds them to your grocery list in one click.
                        </p>
                    </div>
                    <div className="mt-6 pt-2 text-xs font-semibold text-cook-accent flex items-center gap-1">
                        Chat with AI &rarr;
                    </div>
                </div>

                {/* Card 4 */}
                <div className="bg-cook-surface/40 rounded-2xl p-6 shadow-xs border border-dashed border-cook-primary/25 hover:border-cook-primary/40 transition-all flex flex-col justify-between">
                    <div>
                        <div className="size-12 rounded-xl bg-cook-primary/5 text-cook-muted flex items-center justify-center mb-5">
                            <PlusIcon className="size-6 animate-pulse" />
                        </div>
                        <h3 className="text-xl font-bold text-cook-main mb-2">Many More to Come</h3>
                        <p className="text-cook-muted text-sm leading-relaxed">
                            Meal planning calendars, automated pantry inventory tracking, personalized recipe books, and smart leftover management.
                        </p>
                    </div>
                    <div className="mt-6 pt-2 text-xs font-semibold text-cook-muted">
                        Stay tuned for updates!
                    </div>
                </div>
            </section>

            {/* Interactive Mockups Section */}
            <section id="demo" className="max-w-7xl mx-auto px-4 scroll-mt-24">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-extrabold text-cook-main">See how it all fits together</h2>
                    <p className="text-cook-muted mt-2">Try checking items off the list or interacting with the demo components below.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
                    {/* Mock AI Chatbot Component */}
                    <div className="bg-cook-surface rounded-3xl p-6 shadow-md border border-cook-primary/10 flex flex-col h-full">
                        <div className="flex items-center gap-3 border-b border-cook-primary/20 pb-4 mb-4">
                            <div className="size-10 rounded-full bg-cook-accent text-white flex items-center justify-center">
                                <SparklesIcon className="size-5" />
                            </div>
                            <div>
                                <h4 className="font-bold text-cook-main text-sm">AI Sous-Chef</h4>
                                <p className="text-[10px] text-cook-muted">Online &bull; Ready to help</p>
                            </div>
                        </div>

                        <div className="flex-1 space-y-4 min-h-[300px] flex flex-col justify-end">
                            {/* User message */}
                            <div className="self-end max-w-[80%] bg-cook-primary/20 text-cook-main rounded-2xl rounded-tr-none px-4 py-2.5 text-sm shadow-xs font-medium">
                                Find a cozy Tuscan chicken pasta recipe for two, please!
                            </div>

                            {/* AI message */}
                            <div className="self-start max-w-[90%] bg-cook-bg text-cook-main rounded-2xl rounded-tl-none p-4 text-sm shadow-xs border border-cook-primary/10 space-y-3">
                                <p className="font-bold text-cook-accent">Tuscan Butter Chicken Pasta (2 Portions)</p>
                                <p className="text-xs text-cook-muted leading-relaxed">Creamy garlic sauce with sundried tomatoes, spinach, and grilled chicken over penne pasta.</p>

                                <div className="bg-cook-surface/60 rounded-xl p-3 text-xs space-y-1.5 border border-cook-primary/10">
                                    <div className="font-semibold text-cook-main">Required Ingredients:</div>
                                    <ul className="list-disc list-inside text-cook-muted space-y-0.5">
                                        <li>300g Penne pasta</li>
                                        <li>2 Chicken breasts</li>
                                        <li>150ml Heavy cream</li>
                                        <li>Fresh spinach</li>
                                    </ul>
                                </div>

                                <div className="pt-2 flex flex-wrap gap-2">
                                    <button
                                        onClick={() => {
                                            // Add them to the list automatically!
                                            const itemsToAdd = [
                                                'Penne pasta (300g)',
                                                'Chicken breasts (2 pcs)',
                                                'Heavy cream (150ml)',
                                                'Fresh spinach'
                                            ]
                                            setGroceryList(prev => {
                                                const nextList = [...prev]
                                                itemsToAdd.forEach(name => {
                                                    if (!nextList.some(item => item.name.toLowerCase().includes(name.toLowerCase().split(' ')[0]))) {
                                                        nextList.push({ id: Date.now() + Math.random(), name, checked: false })
                                                    }
                                                })
                                                return nextList
                                            })
                                        }}
                                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold cursor-pointer shadow-xs hover:scale-[1.02] transition-transform"
                                    >
                                        <PlusIcon className="size-3.5" />
                                        Add all ingredients to Grocery List
                                    </button>
                                    <button className="px-3 py-2 rounded-lg text-xs font-semibold bg-transparent border border-cook-primary/40 text-cook-main hover:bg-cook-primary/10 hover:border-cook-primary transition-all cursor-pointer">
                                        Save recipe
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-cook-primary/10 flex gap-2">
                            <input
                                type="text"
                                placeholder="Ask for recipe ideas, diets, or shopping advice..."
                                className="flex-1 px-4 py-2 rounded-xl text-sm border border-cook-primary/20 focus:outline-none focus:border-cook-accent bg-cook-bg transition-colors"
                                disabled
                            />
                            <button className="px-4 py-2 rounded-xl text-sm font-semibold cursor-not-allowed opacity-60">Send</button>
                        </div>
                    </div>

                    {/* Interactive Grocery List Component */}
                    <div className="bg-cook-surface rounded-3xl p-6 shadow-md border border-cook-primary/10 flex flex-col h-full">
                        <div className="flex items-center justify-between border-b border-cook-primary/20 pb-4 mb-4">
                            <div className="flex items-center gap-3">
                                <div className="size-10 rounded-full bg-cook-primary text-cook-surface flex items-center justify-center">
                                    <ShoppingCartIcon className="size-5" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-cook-main text-sm">Shared Grocery List</h4>
                                    <p className="text-xs text-cook-muted">Shared with Partner</p>
                                </div>
                            </div>
                            <span className="bg-cook-accent/15 text-cook-accent px-2.5 py-1 rounded-full text-xs font-bold">
                                {groceryList.filter(item => !item.checked).length} items left
                            </span>
                        </div>

                        {/* List */}
                        <div className="flex-1 space-y-2 overflow-y-auto max-h-[300px] pr-1">
                            {groceryList.map((item) => (
                                <div
                                    key={item.id}
                                    onClick={() => toggleGroceryItem(item.id)}
                                    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer select-none transition-all ${item.checked
                                        ? 'bg-cook-bg/40 border-cook-primary/10 opacity-60'
                                        : 'bg-cook-bg border-cook-primary/10 hover:border-cook-accent/30 shadow-xs'
                                        }`}
                                >
                                    <span className={`text-sm font-medium ${item.checked ? 'line-through text-cook-muted' : 'text-cook-main'}`}>
                                        {item.name}
                                    </span>
                                    <div className={`size-5 rounded-md border flex items-center justify-center transition-all ${item.checked
                                        ? 'bg-cook-accent border-cook-accent text-white'
                                        : 'border-cook-primary/40 bg-white'
                                        }`}>
                                        {item.checked && <CheckIcon className="size-3.5 stroke-[3]" />}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Add Item Form */}
                        <form onSubmit={handleAddItem} className="mt-4 pt-4 border-t border-cook-primary/10 flex gap-2">
                            <input
                                type="text"
                                value={newItemName}
                                onChange={(e) => setNewItemName(e.target.value)}
                                placeholder="Add manual item (e.g. Eggs)..."
                                className="flex-1 px-4 py-2 rounded-xl text-sm border border-cook-primary/20 focus:outline-none focus:border-cook-accent bg-cook-bg transition-colors"
                            />
                            <button type="submit" className="px-4 py-2 rounded-xl text-sm font-semibold flex items-center justify-center cursor-pointer hover:scale-[1.02] transition-transform">
                                Add
                            </button>
                        </form>
                    </div>
                </div>
            </section>
        </div>
    )
}