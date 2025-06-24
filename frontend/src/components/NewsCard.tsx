import { NewsItem } from '../types/news';

interface NewsCardProps {
    news: NewsItem;
}

export default function NewsCard({ news }: NewsCardProps) {
  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title text-lg">{news.title}</h2>
        
        <div className="flex items-center gap-3 text-sm opacity-60">
          <span className="badge badge-outline">{news.media}</span>
          <span>{news.date}</span>
        </div>
        
        {news.description && (
          <p className="text-sm opacity-80 line-clamp-3">{news.description}</p>
        )}
        
        <div className="card-actions justify-end mt-4">
          <a
            href={news.link}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary btn-sm"
          >
            Read
          </a>
        </div>
      </div>
    </div>
  );
} 