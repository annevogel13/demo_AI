Slide 1: AI-Agenten für Softwareentwicklung

How to Accept AI in Software Building Workflows

"Artificial Intelligence is no longer a futuristic 'nice-to-have'; it is the silent engine running in the background of almost every industry today. But in the world of software development, we are moving past simple autocompletion and into the era of autonomous agents that don't just suggest code, but actually build systems."
Slide 2: Current Tools

Claude, Gemini, and GitHub Copilot

"When it comes to tools, the first thing to realize is that there is no 'one size fits all.' To choose the right one, you have to separate your evaluation into three distinct categories:

    Model Quality: How well does it 'think'? This is about code quality, stability, and logic (e.g., Claude 3.5 Sonnet is currently a fan favorite for logic).

    Agent Capabilities: Can the tool actually do things? Does it have file access, terminal control, and the ability to run tests?

    Workflow Integration: Does it live where you work?

Types of Help:
Most AI assistance falls into three buckets:

    Q&A: Asking questions about an existing codebase.

    Execution: Letting an agent perform a task for you.

    Planning: Mapping out upcoming work before a single line is written.

Choose your model based on which of these three you need most in the moment."

Slide 3: How to Start an Application

From Brainstorming to Constraints

"Starting a new project used to mean staring at a blank screen. Now, it starts with a conversation. You can use an AI to explore tech stack possibilities and—crucially—add your own real-world constraints, such as 'must be offline-first' or 'must use an MSSQL server.'

What should you hand over to the Agent?

    The 'Green Light' Tasks: Boilerplate code, refactoring, drafting tests, documentation, and log analysis. These are high-speed, high-value AI tasks.

    The 'Red Light' Tasks: Be careful with high-impact architectural decisions, security-critical components, or complex business logic where the requirements are still fuzzy. These require a human pilot."

Slide 4: Software Phases

The Iterative Workflow

"How does the workflow change? Think of it as SCRUM but in minutes, not weeks. We move through cycles of planning and execution at lightning speed.

The golden rule here is: 'Spec first, code second.' AI works significantly better when you provide a clear specification before asking for implementation. If the spec is solid, the code follows almost effortlessly."
Shutterstock

 The 4 Main Software Tasks

Planning, Architecture, Features, and Bugs

"We can break down AI's role into four pillars:

    Planning: Use the AI as a sparring partner. Bounce ideas off it, then extract the final prompt to use for the next step.

    Base Architecture: Let the prompt create the skeleton. Have it connect the components and set up the directory structure.

    Features: This is per-feature prompting. The agent builds the feature, but keep the human in the loop to verify it meets the 'feel' of the requirements.

    Bug Fixes: Let the AI analyze the logs and identify potential culprits. It can propose the fix, but you provide the final 'okay' to deploy."

Slide 6: How to Integrate AI

Where the Magic Happens

"Integration happens in three main areas:

    Web-based: For high-level brainstorming and planning.

    IDE Extensions: Like VS Code with Antigravity or Copilot, where the AI has direct context of your files.

    Command Line (CLI): For agents that can execute shell commands and run your build pipeline.

4 Tips for Working with AI:

    Provide Context: An AI is only as smart as the information you give it.

    Verify, Don't Trust: Always review the output; AI can be confidently wrong.

    Modularize: Small, focused prompts work better than one giant 'do everything' command.

    Iterate: If the first result is bad, refine your instruction rather than giving up."

Slide 7: Competition & Demo

Speed vs. Responsibility

"To wrap up: In today’s market, AI generates the speed. If you aren't using it, you're competing against people who are moving 10 times faster than you.

However, Humans provide the direction and the responsibility. The AI doesn't care if the app fails in production—you do. Use the speed of the agent, but never let go of the steering wheel.

Now, let's look at how this works in practice..."
(Proceed to Demo)