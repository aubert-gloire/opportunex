// ---------------------------------------------------------------------------
// External Jobs — RemoteOK + Jobicy (completely free, no auth required)
// YouTube Video Search — requires YOUTUBE_API_KEY (10k units/day free)
// ---------------------------------------------------------------------------

// @desc    Get remote jobs from external sources
// @route   GET /api/external/jobs
// @access  Private
export const getExternalJobs = async (req, res) => {
  try {
    const { search = '', limit = 12 } = req.query;
    const jobs = [];

    // ── RemoteOK ────────────────────────────────────────────────────────────
    try {
      const rokRes = await fetch('https://remoteok.com/api', {
        headers: { 'User-Agent': 'OpportuneX/1.0 (Rwanda Career Platform)' },
        signal: AbortSignal.timeout(8000),
      });
      const rokData = await rokRes.json();

      const rokJobs = rokData
        .slice(1) // first item is legal notice
        .filter((job) => {
          if (!job.position || !job.company) return false;
          if (!search) return true;
          const q = search.toLowerCase();
          return (
            job.position?.toLowerCase().includes(q) ||
            job.company?.toLowerCase().includes(q) ||
            job.tags?.some((t) => t.toLowerCase().includes(q))
          );
        })
        .slice(0, 8)
        .map((job) => ({
          _id: `remoteok-${job.id}`,
          title: job.position,
          companyName: job.company,
          type: 'remote',
          location: 'Worldwide Remote',
          isRemote: true,
          source: 'RemoteOK',
          externalUrl: job.url,
          tags: (job.tags || []).slice(0, 5),
          createdAt: job.date,
          companyLogo: job.company_logo || null,
          description: job.description ? job.description.replace(/<[^>]*>/g, '').slice(0, 200) + '…' : null,
        }));

      jobs.push(...rokJobs);
    } catch (err) {
      console.error('[External Jobs] RemoteOK error:', err.message);
    }

    // ── Jobicy ───────────────────────────────────────────────────────────────
    try {
      const tag = search || 'developer';
      const jobicyRes = await fetch(
        `https://jobicy.com/api/v2/remote-jobs?count=8&tag=${encodeURIComponent(tag)}`,
        { signal: AbortSignal.timeout(8000) }
      );
      const jobicyData = await jobicyRes.json();

      if (Array.isArray(jobicyData.jobs)) {
        const jobicyJobs = jobicyData.jobs.slice(0, 8).map((job) => ({
          _id: `jobicy-${job.id}`,
          title: job.jobTitle,
          companyName: job.companyName,
          type: 'remote',
          location: job.jobGeo || 'Worldwide Remote',
          isRemote: true,
          source: 'Jobicy',
          externalUrl: job.url,
          sector: Array.isArray(job.jobIndustry) ? job.jobIndustry[0] : null,
          tags: Array.isArray(job.jobType) ? job.jobType : [],
          createdAt: job.pubDate,
          companyLogo: job.companyLogo || null,
          description: job.jobExcerpt || null,
        }));
        jobs.push(...jobicyJobs);
      }
    } catch (err) {
      console.error('[External Jobs] Jobicy error:', err.message);
    }

    res.json({
      success: true,
      count: jobs.length,
      jobs: jobs.slice(0, Number(limit)),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching external jobs', error: error.message });
  }
};

// @desc    Search Open Library for learning resources (completely free, no key)
// @route   GET /api/external/books
// @access  Private
export const searchOpenLibrary = async (req, res) => {
  try {
    const { q = 'career skills', limit = 5 } = req.query;

    const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(q)}&limit=${limit}&fields=key,title,author_name,first_publish_year,subject,cover_i,number_of_pages_median`;

    const response = await fetch(url, { signal: AbortSignal.timeout(8000) });
    const data = await response.json();

    const books = (data.docs || []).map((book) => ({
      key: book.key,
      title: book.title,
      authors: book.author_name?.slice(0, 2).join(', ') || 'Unknown',
      year: book.first_publish_year || null,
      pages: book.number_of_pages_median || null,
      subjects: (book.subject || []).slice(0, 4),
      coverUrl: book.cover_i
        ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
        : null,
      openLibraryUrl: `https://openlibrary.org${book.key}`,
    }));

    res.json({ success: true, count: books.length, books });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error searching Open Library', error: error.message });
  }
};

// @desc    Search YouTube for career/skill videos
// @route   GET /api/external/youtube
// @access  Private
export const searchYouTubeVideos = async (req, res) => {
  try {
    const { q = 'career skills africa', maxResults = 6 } = req.query;

    if (!process.env.YOUTUBE_API_KEY) {
      return res.json({ success: true, videos: [], message: 'YouTube API not configured — add YOUTUBE_API_KEY to .env' });
    }

    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(q)}&type=video&maxResults=${maxResults}&key=${process.env.YOUTUBE_API_KEY}&relevanceLanguage=en&safeSearch=strict&videoEmbeddable=true`;

    const response = await fetch(url, { signal: AbortSignal.timeout(8000) });
    const data = await response.json();

    if (data.error) {
      return res.status(400).json({ success: false, message: data.error.message });
    }

    const videos = (data.items || []).map((item) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      channel: item.snippet.channelTitle,
      thumbnail: item.snippet.thumbnails?.medium?.url,
      publishedAt: item.snippet.publishedAt,
      description: item.snippet.description?.slice(0, 120) + '…',
    }));

    res.json({ success: true, videos });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error searching YouTube', error: error.message });
  }
};
