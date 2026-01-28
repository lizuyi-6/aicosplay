/**
 * SVG Background Generator Service
 * Uses AI to generate unique SVG backgrounds for each character
 */

const OpenAI = require('openai');

// Initialize OpenAI client with qwen configuration
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: process.env.OPENAI_BASE_URL
});

const SVG_PROMPT_TEMPLATE = `You are a master SVG artist. Generate a THEMATIC background animation that DIRECTLY reflects this character's identity.

=== CHARACTER INFO ===
Name: {{name}}
Personality: {{personality}}
Story: {{description}}

=== CRITICAL INSTRUCTIONS ===
Your SVG must contain RECOGNIZABLE THEMATIC ELEMENTS that a viewer can immediately associate with this character's story. 

Examples of what I mean:
- For a SPACE character: Draw actual planets with rings, rocket ships, constellations, wormholes, space stations
- For a WIZARD/MAGE: Draw magic circles with arcane symbols, floating crystals, spell runes (ᚠᚢᚦᚨ), potion bottles
- For a HACKER/CYBER: Draw binary code (0101), terminal windows, circuit boards, data streams, glitch effects
- For a NATURE/ELF: Draw tree silhouettes, falling leaves, vines, flowers, moon phases
- For a ROBOT: Draw gears, cogs, circuit patterns, mechanical arms, digital displays
- For a DETECTIVE: Draw magnifying glass, footprints, question marks, Victorian patterns
- For a POET/SCHOLAR: Draw ink brushstrokes, scrolls, bamboo, mountain silhouettes, moon
- For a DOCTOR/MEDICAL: Draw heartbeat lines, medical crosses, mechanical prosthetics, pills

=== SVG REQUIREMENTS ===
1. viewBox="0 0 1000 1000"
2. Use stroke lines with "currentColor" (no fills except small accents)
3. stroke-width between 1-4, opacity between 0.3-1.0
4. Include 4-6 distinct, RECOGNIZABLE thematic elements spread across the canvas
5. Add CSS animation classes: rotate-slow, float, pulse, draw-path
6. Style: elegant line-art, atmospheric, NOT cartoonish
7. CRITICAL: Do NOT add any background-color or style="background:..." to the svg tag. Must be transparent.

=== OUTPUT ===
Return ONLY the raw SVG code. No markdown, no explanation.
Start with <svg and end with </svg>`;


/**
 * Generate a unique SVG background for a character
 * @param {string} name - Character name
 * @param {string} personality - Character personality traits
 * @param {string} description - Character background story
 * @returns {Promise<string>} The generated SVG code
 */
async function generateBackgroundSvg(name, personality, description) {
    try {
        const prompt = SVG_PROMPT_TEMPLATE
            .replace('{{name}}', name)
            .replace('{{personality}}', personality)
            .replace('{{description}}', description);

        console.log(`🎨 [SVG Generator] Generating background for: ${name}`);

        const response = await openai.chat.completions.create({
            model: process.env.OPENAI_MODEL || 'qwen-max',
            messages: [
                {
                    role: 'system',
                    content: 'You are an expert SVG artist. You create beautiful, minimalist, animated SVG backgrounds. You output ONLY valid SVG code, nothing else.'
                },
                {
                    role: 'user',
                    content: prompt
                }
            ],
            temperature: 0.8, // Higher for more creativity
            max_tokens: 2000
        });

        let svgCode = response.choices[0]?.message?.content || '';

        // Clean up the response - extract only the SVG
        svgCode = extractSvg(svgCode);

        // Validate and fix common issues
        svgCode = validateAndFixSvg(svgCode);

        console.log(`✅ [SVG Generator] Successfully generated background for: ${name}`);
        return svgCode;

    } catch (error) {
        console.error(`❌ [SVG Generator] Failed to generate for ${name}:`, error.message);
        // Return a fallback minimal SVG
        return generateFallbackSvg(name);
    }
}

/**
 * Extract SVG code from potentially messy AI response
 */
function extractSvg(text) {
    // Remove markdown code blocks if present
    text = text.replace(/```svg\n?/gi, '').replace(/```xml\n?/gi, '').replace(/```\n?/g, '');

    // Extract SVG tag
    const svgMatch = text.match(/<svg[\s\S]*?<\/svg>/i);
    if (svgMatch) {
        return svgMatch[0];
    }

    return text.trim();
}

/**
 * Validate and fix common SVG issues
 */
function validateAndFixSvg(svg) {
    // Ensure it starts with <svg
    if (!svg.startsWith('<svg')) {
        return generateFallbackSvg('Unknown');
    }

    // Ensure viewBox is correct
    if (!svg.includes('viewBox')) {
        svg = svg.replace('<svg', '<svg viewBox="0 0 1000 1000"');
    }

    // Add preserveAspectRatio if missing
    if (!svg.includes('preserveAspectRatio')) {
        svg = svg.replace('<svg', '<svg preserveAspectRatio="xMidYMid slice"');
    }

    // Ensure class="bg-svg" for styling
    if (!svg.includes('class="')) {
        svg = svg.replace('<svg', '<svg class="bg-svg"');
    }

    return svg;
}

/**
 * Generate a simple fallback SVG if AI generation fails
 */
function generateFallbackSvg(name) {
    const hash = simpleHash(name);
    const cx = 400 + (hash % 200);
    const cy = 400 + ((hash >> 8) % 200);
    const r = 150 + (hash % 100);

    return `<svg class="bg-svg" viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice">
  <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="currentColor" stroke-width="2" class="draw-path"/>
  <circle cx="${cx}" cy="${cy}" r="${r + 50}" fill="none" stroke="currentColor" stroke-width="1" opacity="0.5" class="rotate-slow"/>
</svg>`;
}

function simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) - hash) + str.charCodeAt(i);
        hash |= 0;
    }
    return Math.abs(hash);
}

module.exports = { generateBackgroundSvg };
